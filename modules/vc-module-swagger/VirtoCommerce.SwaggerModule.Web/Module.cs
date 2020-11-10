using System;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Web.Swagger;
using VirtoCommerce.SwaggerModule.Core.Extensions;

namespace VirtoCommerce.SwaggerModule.Web
{
    public class Module : IModule
    {
        public const string platformDocName = "VirtoCommerce.Platform";
        public const string platformUIDocName = "PlatformUI";
        private const string oauth2SchemeName = "oauth2";

        public ManifestModuleInfo ModuleInfo { get; set; }

        public void Initialize(IServiceCollection services)
        {
            var provider = services.BuildServiceProvider();
            var modules = provider.GetService<IModuleCatalog>().Modules.OfType<ManifestModuleInfo>().Where(m => m.ModuleInstance != null).ToArray();

            services.AddSwaggerGen(c =>
            {
                var platformInfo = new OpenApiInfo
                {
                    Title = "VirtoCommerce Solution REST API documentation",
                    Version = "v1",
                    TermsOfService = new Uri("https://virtocommerce.com/terms"),
                    Description = "For this sample, you can use the key to satisfy the authorization filters.",
                    Contact = new OpenApiContact
                    {
                        Email = "support@virtocommerce.com",
                        Name = "Virto Commerce",
                        Url = new Uri("https://virtocommerce.com")
                    },
                    License = new OpenApiLicense
                    {
                        Name = "Virto Commerce Open Software License 3.0",
                        Url = new Uri("http://virtocommerce.com/opensourcelicense")
                    }
                };

                c.SwaggerDoc(platformDocName, platformInfo);
                c.SwaggerDoc(platformUIDocName, platformInfo);

                foreach (var module in modules)
                {
                    c.SwaggerDoc(module.ModuleName, new OpenApiInfo { Title = $"{module.Id}", Version = "v1" });
                }

                c.TagActionsBy(api => api.GroupByModuleName(services));
                c.IgnoreObsoleteActions();
                // This temporary filter removes broken "application/*+json" content-type.
                // It seems it's some openapi/swagger bug, because Autorest fails.
                c.OperationFilter<ConsumeFromBodyFilter>();
                c.OperationFilter<FileResponseTypeFilter>();
                c.OperationFilter<OptionalParametersFilter>();
                c.OperationFilter<ArrayInQueryParametersFilter>();
                c.OperationFilter<FileUploadOperationFilter>();
                c.OperationFilter<SecurityRequirementsOperationFilter>();
                c.OperationFilter<TagsFilter>();
                c.SchemaFilter<EnumSchemaFilter>();
                c.SchemaFilter<SwaggerIgnoreFilter>();
                c.MapType<object>(() => new OpenApiSchema { Type = "object" });
                c.AddModulesXmlComments(services);
                c.CustomOperationIds(apiDesc =>
                    apiDesc.TryGetMethodInfo(out var methodInfo) ? $"{((ControllerActionDescriptor)apiDesc.ActionDescriptor).ControllerName}_{methodInfo.Name}" : null);
                c.AddSecurityDefinition(oauth2SchemeName, new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Description = "OAuth2 Resource Owner Password Grant flow",
                    Flows = new OpenApiOAuthFlows()
                    {
                        Password = new OpenApiOAuthFlow()
                        {
                            TokenUrl = new Uri($"/connect/token", UriKind.Relative)
                        }
                    },
                });

                c.DocInclusionPredicate((docName, apiDesc) =>
                {
                    if (docName.EqualsInvariant(platformUIDocName)) return true; // It's an UI endpoint, return all to correctly build swagger UI page

                    var currentAssembly = ((ControllerActionDescriptor)apiDesc.ActionDescriptor).ControllerTypeInfo.Assembly;
                    if (docName.EqualsInvariant(platformDocName) && currentAssembly.FullName.StartsWith(docName)) return true; // It's a platform endpoint. 
                    // It's a module endpoint. 
                    var module = modules.FirstOrDefault(m => m.ModuleName.EqualsInvariant(docName));
                    return module != null && module.Assembly == currentAssembly;
                });
                c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());

                c.EnableAnnotations(enableAnnotationsForInheritance: true, enableAnnotationsForPolymorphism: true);
            });

            // Unfortunately, we can't use .CustomSchemaIds, because it changes schema ids for all documents (impossible to change ids depending on document name).
            // But we need this, because PlatformUI document should contain ref schema ids as type.FullName to avoid conflict with same type names in different modules.
            // As a solution we use custom swagger generator that catches document name and generates schemaids depending on it
            services.AddTransient<ISwaggerProvider, CustomSwaggerGenerator>();

            //This is important line switches the SwaggerGenerator to use the Newtonsoft contract resolver that uses the globally registered PolymorphJsonContractResolver
            //to propagate up to the resulting OpenAPI schema the derived types instead of base domain types
            services.AddSwaggerGenNewtonsoftSupport();
        }

        public void PostInitialize(IApplicationBuilder applicationBuilder)
        {
            applicationBuilder.UseSwagger(c =>
            {
                c.RouteTemplate = "docs/{documentName}/swagger.json";
                c.PreSerializeFilters.Add((swagger, httpReq) =>
                {
                    //TODO
                    //swagger.BasePath = $"{httpReq.Scheme}://{httpReq.Host.Value}";
                });

            });

            var modules = applicationBuilder.ApplicationServices.GetService<IModuleCatalog>().Modules.OfType<ManifestModuleInfo>().Where(m => m.ModuleInstance != null).ToArray();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
            applicationBuilder.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint($"./{platformUIDocName}/swagger.json", platformUIDocName);
                c.SwaggerEndpoint($"./{platformDocName}/swagger.json", platformDocName);
                foreach (var module in modules)
                {
                    c.SwaggerEndpoint($"./{module.Id}/swagger.json", module.Id);
                }
                c.RoutePrefix = "docs";
                c.EnableValidator();
                //TODO
                //c.IndexStream = () =>
                //{
                //    var type = typeof(Module).GetTypeInfo().Assembly.GetManifestResourceStream("VirtoCommerce.SwaggerModule.Web.Content.index.html");
                //    return type;
                //};
                c.DocumentTitle = "VirtoCommerce Solution REST API documentation";
                //c.InjectStylesheet("/swagger/vc.css");
                c.ShowExtensions();
                c.DocExpansion(DocExpansion.None);
                c.DefaultModelsExpandDepth(-1);
            });
        }

        public void Uninstall()
        {
            // do nothing in here
        }


        

    }
}
