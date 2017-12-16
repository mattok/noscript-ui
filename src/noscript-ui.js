/**
 * NoScript UI
 * https://github.com/mattok/noscript-ui
 * @author mattok https://github.com/mattok
 * @version 1.0.0-alpha-1
 * @licence MIT
 */
(
  function(global)
  {
    "use strict";

    var NoScriptUI =
    {
      
      /**
       * Constants
       */
      "const":
      {
        // Define the available resource types
        "resource-types":
        {
          "script": "Scripts"
          , "media": "Images, videos, etc."
          , "webgl": "Webgl"
          , "font": "Fonts"
          , "frames": "Frames"
          , "other": "Other things, such as ..."
        }

        // Define the available access types
        , "access-types":
        {
          'site-allow':
          {
            "description": 'Active for this site'
            , "style": "info"
          }

          , 'global-allow':
          {
            "description": 'Active anywhere'
            , "style": "info"
          }

          , 'site-deny':
          {
            "description": 'Blocked for this site'
            , "style": "danger"
          }

          , 'global-deny':
          {
            "description": 'Blocked everywhere'
            , "style": "danger"
          }
        }

        , "url-component-types":
        {
          "scheme": "The URL scheme e.g. http, https, ftp, etc."
          , "username": "The URL username, if any. e.g. user in https://user@example.org/"
          , "domain": "The domain, (if not an IP). e.g. example.org in https://sub.domain.example.org/"
          , "subdomain": "The subdmain (if not an IP). e.g. sub.domain in https://sub.domain.example.org"
          , "ip": "The ip (if not a domain). e.g. 234.234.234.234 in https://234.234.234.234/"
          , "port": "The port, if any is made explicit. e.g. 8080 in https://example.org:8080/"
        }
      }

      /**
       * User config.
       * Any changes to this should be saved to local storage
       */
      , "config":
      {
        // Define components that, if present, define a unique site by default.
        // By default, treat sites with different schemes, usernames, ports or full domains as unique.
        "default-components":
        [
          "scheme"
          , "username"
          , "ip"
          , "subdomain"
          , "domain"
          , "port"
        ]
        
        // The user's policy.
        // Anything not explicitly matching a rule in this policy is blocked.
        , "policy":
        {
          // Site-specific rules allowing or blocking resources
          "sites":
          {
//            // Patterns matching the primary sites that the rules apply to
//            "site.org":
//            {
//              // Patterns matching the sites having resources that are
//              // controlled on the primary site
//              "youtube.com":
//              {
//                // Resources that are explicitly controlled.
//                // true means allowed
//                // false means blocked
//                "font": true
//              }            
//              , "myblog.com":
//              {
//                // Resources that are explicitly controlled.
//                // true means allowed
//                // false means blocked
//                "script": false
//              }
//            }
          }

          // Rules allowing or blocking resources across all sites
          , "global":
          {
//            // Patterns matching the sites having resources that are
//            // controlled on any site
//            "youtube.com":
//            {
//              // Resources that are explicitly controlled.
//              // true means allowed
//              // false means blocked
//              "webgl": true
//              , "script": false
//            }
          }        
        }

      }
      
      // stores the temporary state of the application
      , "session":
      {
      }
      
      , "method":
      {
        "ForgetRule": function( theForgetButtonEl )
        {
          var el = $(theForgetButtonEl);
          var categorisedItemEl = el.parents('.noscript-categorised-item');
          $('.noscript-types input[type="checkbox"]:not(:disabled):checked', categorisedItemEl).each(
            function()
            {
              var el = $(this);
              var ruleData = el.data();
              if ( ! ( ruleData["category"] in NoScriptUI.config.policy ) )
              {
                console.log('Expecting to find category: ' + ruleData["category"] + ' in policy, but didn\'t.');
                return false;
              }
              var category = NoScriptUI.config.policy[ruleData["category"]];
              if ( ! ( ruleData["primaryUrl"] in category ) )
              {
                console.log('Expecting to find primary-url: ' + ruleData["category"] + '.' + ruleData["primaryUrl"] + ' in policy, but didn\'t.');
                return false;
              }
              var primaryUrl = category[ruleData["primaryUrl"]];
              var types;
              if ( ( "secondaryUrl" in ruleData) )
              {
                if ( ! ( ruleData["secondaryUrl"] in primaryUrl ) )
                {
                  console.log('Expecting to find secondary-url: ' + ruleData["category"] + '.' + ruleData["primaryUrl"] + '.' + ruleData["secondaryUrl"] + ' in policy, but didn\'t.');
                  return false;
                }
                types = primaryUrl[ruleData["secondaryUrl"]];
                if ( ! ( ruleData["type"] in types ) )
                {
                  console.log('Expecting to find type: ' + ruleData["category"] + '.' + ruleData["primaryUrl"] + ( "secondaryUrl" in ruleData ? ( '.' + ruleData["secondaryUrl"] ) : '' ) + '.' + ruleData["type"] + ' in policy, but didn\'t.');
                  return false;
                }
                delete NoScriptUI.config.policy
                  [ruleData["category"]]
                  [ruleData["primaryUrl"]]
                  [ruleData["secondaryUrl"]]
                  [ruleData["type"]];
                if ( Object.keys(NoScriptUI.config.policy
                  [ruleData["category"]]
                  [ruleData["primaryUrl"]]
                  [ruleData["secondaryUrl"]]
                  ).length == 0 )
                {
                  delete NoScriptUI.config.policy
                    [ruleData["category"]]
                    [ruleData["primaryUrl"]]
                    [ruleData["secondaryUrl"]];
                }
                if ( Object.keys(NoScriptUI.config.policy
                  [ruleData["category"]]
                  [ruleData["primaryUrl"]]
                  ).length == 0 )
                {
                  delete NoScriptUI.config.policy
                    [ruleData["category"]]
                    [ruleData["primaryUrl"]];
                }                
              }
              else
              {
                types = primaryUrl;
                if ( ! ( ruleData["type"] in types ) )
                {
                  console.log('Expecting to find type: ' + ruleData["category"] + '.' + ruleData["primaryUrl"] + ( "secondaryUrl" in ruleData ? ( '.' + ruleData["secondaryUrl"] ) : '' ) + '.' + ruleData["type"] + ' in policy, but didn\'t.');
                  return false;
                }
                delete NoScriptUI.config.policy
                  [ruleData["category"]]
                  [ruleData["primaryUrl"]]
                  [ruleData["type"]];
                if ( Object.keys(NoScriptUI.config.policy
                  [ruleData["category"]]
                  [ruleData["primaryUrl"]]
                  ).length == 0 )
                {
                  delete NoScriptUI.config.policy
                    [ruleData["category"]]
                    [ruleData["primaryUrl"]];
                }
              }
            }
          );
  
          return true;

        }

        // Given an URL, returns an array of the components it has
        , "URLComponents": function( theURL )
        {
          var rule = theURL.includes('://') ? theURL : ( '://' + theURL );
          var uri = new URI( rule );
          var components = [];
          if ( uri.scheme().length > 0 )
          {
            components.push("scheme");
          }
          if ( uri.username().length > 0 )
          {
            components.push("username");
          }
          //if ( uri.password() && uri.password().length > 0 )
          //{
          //  components.push("password");
          //}
          if ( uri.is("IP") )
          {
            if ( uri.hostname().length > 0 )
            {
              components.push("ip");
            }
          }
          else
          {
            if ( uri.subdomain().length > 0 )
            {
              components.push("subdomain");
            }
            if ( uri.domain().length > 0 )
            {
              components.push("domain");
            }
          }
          if ( uri.port().length > 0 )
          {
            components.push("port");
          }
          return components;
        }

        // Given an URL and some components, return a rule including only
        // the given components
        , "RuleFromComponents": function( theURL, theComponents )
        {
          var uri = URI( theURL.includes('://') ? theURL : ( '://' + theURL ) );
          var rule = '';
          if ( theComponents.indexOf('scheme') !== -1 )
          {
            var scheme = uri.scheme();
            if ( scheme.length > 0 )
            {
              rule += scheme + '://';
            }
          }
          if ( theComponents.indexOf('username') !== -1 )
          {
            var username = uri.username();
            if ( username.length > 0 )
            {
              rule += username + '@';
            }
          }
          if ( uri.is("IP") )
          {
            if ( theComponents.indexOf('ip') !== -1 )
            {
              var hostname = uri.hostname();
              if ( hostname.length > 0 )
              {
                rule += hostname;
              }
            }
          }
          else
          {
            if ( theComponents.indexOf('subdomain') !== -1 )
            {
              var subdomain = uri.subdomain();
              if ( subdomain.length > 0 )
              {
                rule += subdomain + '.';
              }
            }
            if ( theComponents.indexOf('domain') !== -1 )
            {
              var domain = uri.domain();
              if ( domain.length > 0 )
              {
                rule += domain;
              }
            }
          }
          if ( theComponents.indexOf('port') !== -1 )
          {
            var port = uri.port();
            if ( port.length > 0 )
            {
              rule += ':' + port;
            }
          }

          return rule;

        }

        , "MatchRuleToUrl": function( theRule, theUrl )
        {
          // ensure that rules are treated as applying to domains and not paths/queries etc.
          var rule = theRule.includes('://') ? theRule : ( '://' + theRule );
          var url = theUrl.includes('://') ? theUrl : ( '://' + theUrl );
          var ruleURI = new URI( rule );
          var urlURI = new URI( url );
          // Whether or we matched at least one URL component
          var matchedAnUrlComponent = false;

          var ruleURIScheme = ruleURI.scheme();
          if ( ruleURIScheme.length > 0 )
          {
            var urlURIScheme = urlURI.scheme();
            if (
              urlURIScheme == ''
              || urlURIScheme != ruleURIScheme
              )
            {
              return false;
            }
            matchedAnUrlComponent = true;
          }

          var ruleURIUsername = ruleURI.username();
          if ( ruleURIUsername.length > 0 )
          {
            var urlURIUsername = urlURI.username();
            if (
              urlURIUsername == ''
              || urlURIUsername != ruleURIUsername
              )
            {
              return false;
            }
            matchedAnUrlComponent = true;
          }

          var ruleURIPassword = ruleURI.password();
          if ( ruleURIPassword.length > 0 )
          {
            var urlURIPassword = urlURI.password();
            if (
              urlURIPassword == ''
              || urlURIPassword != ruleURIPassword
              )
            {
              return false;
            }
            matchedAnUrlComponent = true;
          }

          if ( ruleURI.is("IP") && urlURI.is("IP") )
          {
            var ruleUriIp = ruleURI.hostname();
            if ( ruleUriIp.length > 0 )
            {
              var urlUriIp = urlURI.hostname();
              if (
                urlUriIp == ''
                || urlUriIp != ruleUriIp
                )
              {
                return false;
              }
              matchedAnUrlComponent = true;
            }          
          }        
          else if ( ! ruleURI.is("IP") && ! urlURI.is("IP") )
          {
            var ruleURIDomain = ruleURI.domain();
            if ( ruleURIDomain.length > 0 )
            {
              var urlURIDomain = urlURI.domain();
              if (
                urlURIDomain == ''
                || urlURIDomain != ruleURIDomain
                )
              {
                return false;
              }
              matchedAnUrlComponent = true;
            }

            var ruleURISubdomain = ruleURI.subdomain();
            if ( ruleURISubdomain.length > 0 )
            {
              var urlURISubdomain = urlURI.subdomain();
              if (
                urlURISubdomain == ''
                || urlURISubdomain != ruleURISubdomain
                )
              {
                return false;
              }
              matchedAnUrlComponent = true;
            }
          }

          var ruleURIPort = ruleURI.port();
          if ( ruleURIPort.length > 0 )
          {
            var urlURIPort = urlURI.port();
            if (
              urlURIPort == ''
              || urlURIPort != ruleURIPort
              )
            {
              return false;
            }
            matchedAnUrlComponent = true;
          }

          return matchedAnUrlComponent;      
        }

        /**
         * 
         * @param string theURL
         * @param object theResources
         * @returns {indexL#4.NoScriptUI.method.Categorise.categorised}
         */
        , "Categorise": function( theURL, theResources )
        {
          var categorised =
          {
            "global-deny": {}
            , "site-deny": {}
            , "global-allow": {}
            , "site-allow": {}
            , "uncategorised": {}
          };

          var nResources = theResources.length;
          for ( var i=0; i<nResources; i++)
          {
            var resource = theResources[i];
            var matched = false;

            var global = NoScriptUI.config.policy.global;
            for ( var primarySiteUrl in global )
            {
              var types = global[primarySiteUrl];
              for ( var type in types )
              {
                if ( type != resource.type )
                {
                  continue;
                }
                if ( ! NoScriptUI.method.MatchRuleToUrl( primarySiteUrl, resource.url ) )
                {
                  continue;
                }

                var category = types[type] ? "global-allow" : "global-deny";
                if ( !( resource.url in categorised[category] ) )
                {
                  categorised[category][resource.url] = {};
                }
                categorised[category][resource.url][resource.type] =
                {
                  "category": "global"
                  , "primary-url": primarySiteUrl
                  , "type": type
                };

                matched = true;
                break;
              }
              if ( matched )
              {
                // skip to the next resource
                break;
              }
            }
            if ( matched )
            {
              // skip to the next resource
              continue;
            }

            var sites = NoScriptUI.config.policy.sites;
            for ( var primarySiteUrl in sites )
            {
              if ( ! NoScriptUI.method.MatchRuleToUrl( primarySiteUrl, theURL ) )
              {
                continue;
              }
              var secondary = sites[primarySiteUrl];
              for ( var secondaryUrl in secondary )
              {
                var types = secondary[secondaryUrl];
                for ( var type in types )
                {
                  if ( type != resource.type )
                  {
                    continue;
                  }
                  if ( ! NoScriptUI.method.MatchRuleToUrl( secondaryUrl, resource.url ) )
                  {
                    continue;
                  }
                  var category = types[type] ? "site-allow" : "site-deny";
                  if ( !( resource.url in categorised[category] ) )
                  {
                    categorised[category][resource.url] = {};
                  }
                  categorised[category][resource.url][resource.type] =
                  {
                    "category": "sites"
                    , "primary-url": primarySiteUrl
                    , "secondary-url": secondaryUrl
                    , "type": type
                  };
                  matched = true;
                  break;
                }
                if ( matched )
                {
                  break;
                }
              }
              if ( matched )
              {
                break;
              }
            }
            if ( matched )
            {
              continue;
            }

            if ( !( resource.url in categorised["uncategorised"] ) )
            {
              categorised["uncategorised"][resource.url] = {};
            }
            categorised["uncategorised"][resource.url][resource.type] = true;
          }
          return categorised;
        }

        , "GetInitialComponents": function ( theURL )
        {
          // Check which URL components should be selected by default...
          // Ensure we have a valid selection.
          var urlComponents = NoScriptUI.method.URLComponents( theURL );
          var matchingDefaultComponents = [];
          {
            var nDefaultComponents = NoScriptUI.config["default-components"].length;
            for (var i=0; i<nDefaultComponents; i++ )
            {
              var defaultComponent = NoScriptUI.config["default-components"][i];
              if ( urlComponents.indexOf(defaultComponent) == -1 )
              {
                continue;
              }
              matchingDefaultComponents.push(defaultComponent);
            }
          }        
          return ( matchingDefaultComponents.length > 0 )
            ? matchingDefaultComponents
            : urlComponents;
        }

      }
      
      , "tpl":
      {
      
        "InputChecked": class InputChecked extends nano.tpl
        {
          html()
          {
            return this.data ? nano.html `checked="checked"` : '';
          }
        }
        
        , "InputDisabled": class InputDisabled extends nano.tpl
        {
          html()
          {
            return this.data ? nano.html `disabled="disabled"` : '';
          }
        }
        
        , "RuleAttributes": class RuleAttributes extends nano.tpl
        {
          html()
          {
            return this.data
              ? (
                nano.html `data-category="${ this.data.category }" data-primary-url="${ this.data["primary-url" ]}" data-type="${ this.data.type }"`
                + ( ( "secondary-url" in this.data ) ? nano.html ` data-secondary-url="${ this.data["secondary-url"] }"` : '' )
                )
              : '';
          }
        }
        
        , "UncategorisedTypes": class UncategorisedTypes extends nano.tpl
        {
          html()
          {
            var output = '';
            for (var type in NoScriptUI.const["resource-types"])
            {
              var enabled = type in this.data.types ? this.data.types[type] : false;
              var disabled = false;
              if ( ! enabled )
              {
                var categorised = NoScriptUI.method.Categorise(
                  NoScriptUI.session["current-url"],
                  [
                    { type: type, url: this.data.url }
                  ]
                );
                if (
                  Object.keys(categorised["global-allow"]).length > 0
                  || Object.keys(categorised["global-deny"]).length > 0
                  || Object.keys(categorised["site-allow"]).length > 0
                  || Object.keys(categorised["site-deny"]).length > 0
                  )
                {
                  disabled = true;
                }
              }
              
              output += nano.html `
  <label class="custom-control custom-checkbox ${ enabled ? 'border border-warning rounded' : '' }" title="${ NoScriptUI.const["resource-types"][type] }">
    <input data-type="${ type }" class="custom-control-input" type="checkbox" ${ new NoScriptUI.tpl.InputChecked( enabled ) } ${ new NoScriptUI.tpl.InputDisabled( disabled ) }>
    <span class="custom-control-indicator m-1"></span>
    <span class="custom-control-description m-1">${ type }</span>
  </label>
  `;
            }
            return output;
          }
        }
    
        , "UncategorisedItems": class UncategorisedItems extends nano.tpl
        {
          html()
          {
            var output = '';
            var i=0;
            for ( var url in this.data.categories.uncategorised )
            {
              i++;
              var typesData =
              {
                "url": url
                , "types": this.data.categories.uncategorised[url]
              };
              var urlData =
              {
                "url": url
                , "url-components": NoScriptUI.session["secondary-site-components"][url]
              };
              output += nano.html `
  <li class="list-group-item list-group-item-action noscript-uncategorised-item" data-url="${ url }" >
    <div class="d-flex justify-content-between">
      <div>
        <button class="btn btn-outline-primary btn-sm mr-1" type="button" data-toggle="collapse" data-target="#noscript-uncategorised-types-${ i }" aria-expanded="false" aria-controls="noscript-uncategorised-types-${ i }">+</button>
        <span class="noscript-secondary-rule" data-url="${ url }">${ new NoScriptUI.tpl.URLRuleSelector( urlData ) }</span>
      </div>
      <div class="btn-toolbar noscript-toolbar" role="toolbar" aria-label"Allow/Block toolbar">
        <span class="btn-group mr-1" role="group" aria-label"Allow group">
          <span class="btn btn-outline-info btn-sm disabled">
            Allow
          </span>
          <button class="btn btn-info btn-sm" type="button" data-access="sites" data-action="allow">
            for site
          </button>
          <span class="btn btn-outline-info btn-sm disabled">
            or
          </span>
          <button class="btn btn-info btn-sm font-weight-bold" type="button" data-access="global" data-action="allow">
            anywhere
          </button>
        </span>
        <span class="btn-group" role="group" aria-label"Block group">
          <span class="btn btn-outline-danger btn-sm disabled">
            Block
          </span>
          <button class="btn btn-danger btn-sm" type="button" data-access="sites" data-action="deny">
            for site
          </button>
          <span class="btn btn-outline-danger btn-sm disabled">
            or
          </span>
          <button class="btn btn-danger btn-sm font-weight-bold" type="button" data-access="global" data-action="deny">
            everywhere
          </button>
        </span>
      </div>
    </div>
    <div id="noscript-uncategorised-types-${ i }" class="collapse mt-1 noscript-types">
      <div class="form-inline justify-content-start">
        ${ new NoScriptUI.tpl.UncategorisedTypes(typesData) }
      </div>
    </div>
  </li>
  `;
            }
            return output;
          }
        }

        , "CategorisedTypes": class CategorisedTypes extends nano.tpl
        {
          html()
          {
            var output = '';
            for (var type in NoScriptUI.const["resource-types"])
            {
              var enabled = type in this.data.types;
              var ruleData = type in this.data.types ? this.data.types[type] : null;
              output += nano.html `
  <label class="custom-control custom-checkbox ${ enabled ? 'border border-' + this.data.style + ' rounded' : '' }" title="${ NoScriptUI.const["resource-types"][type] }">
    <input class="custom-control-input" type="checkbox" ${ new NoScriptUI.tpl.InputChecked( enabled ) } ${ new NoScriptUI.tpl.InputDisabled( ! enabled ) } ${ new NoScriptUI.tpl.RuleAttributes( ruleData ) } >
    <span class="custom-control-indicator m-1"></span>
    <span class="custom-control-description m-1">${ type }</span>
  </label>
  `;
            }
            return output;
          }
        }
    
        , "CategorisedItems": class CategorisedItems extends nano.tpl
        {
          html()
          {
            var output = '';
            var i=0;
            for ( var url in this.data.urls )
            {
              i++;
              var typesData =
              {
                "style": this.data.style
                , "types": this.data.urls[url]
              };
              output += nano.html `
  <li class="list-group-item list-group-item-action noscript-categorised-item" >
    <div class="d-flex justify-content-between">
      <div><button class="btn btn-outline-primary btn-sm mr-1" type="button" data-toggle="collapse" data-target="#noscript-${ this.data["access-type"] }-${ i }" aria-expanded="false" aria-controls="noscript-${ this.data["access-type"] }-${ i }">+</button>${ url }</div>
      <div class="noscript-toolbar">
        <button class="btn btn-primary btn-sm" type="submit" data-url="${ url }">Forget Rule</button>
      </div>
    </div>
    <div id="noscript-${ this.data["access-type"] }-${ i }" class="collapse mt-1 noscript-types">
      ${ new NoScriptUI.tpl.CategorisedTypes(typesData) }
    </div>
  </li>
  `;
            }
            return output;
          }
        }
        
        , "URLRuleSelectorScheme": class URLRuleSelectorScheme extends nano.tpl
        {
          html()
          {
            return ( this.data.scheme.length > 0 )
              ? nano.html `
<label class="btn btn-outline-secondary btn-sm mr-1 mb-0 ${this.data.enabled ? 'active' : '' }">
  <input class="noscript-url-scheme" data-component="scheme" type="checkbox" ${ new NoScriptUI.tpl.InputChecked( this.data.enabled ) } ${ new NoScriptUI.tpl.InputDisabled( this.data.disabled ) } />${ this.data.scheme }://
</label>`
              : '';
          }
        }
        
        , "URLRuleSelectorUsername": class URLRuleSelectorUsername extends nano.tpl
        {
          html()
          {
            return ( this.data.username.length > 0 )
              ? nano.html `
<label class="btn btn-outline-secondary btn-sm mr-1 mb-0 ${this.data.enabled ? 'active' : '' }">
  <input class="noscript-url-username" data-component="username" type="checkbox" ${ new NoScriptUI.tpl.InputChecked( this.data.enabled ) } ${ new NoScriptUI.tpl.InputDisabled( this.data.disabled ) } />${ this.data.username }@
</label>`
              : '';
          }
        }
        
        , "URLRuleSelectorIP": class URLRuleSelectorIP extends nano.tpl
        {
          html()
          {
            return ( this.data.ip.length > 0 )
              ? nano.html `
<label class="btn btn-outline-secondary btn-sm mr-1 mb-0 ${this.data.enabled ? 'active' : '' }">
  <input class="noscript-url-ip" data-component="ip" type="checkbox" ${ new NoScriptUI.tpl.InputChecked( this.data.enabled ) } ${ new NoScriptUI.tpl.InputDisabled( this.data.disabled ) } />${ this.data.ip }
</label>`
              : '';
          }
        }
        
        , "URLRuleSelectorSubdomain": class URLRuleSelectorSubdomain extends nano.tpl
        {
          html()
          {
            return ( this.data.subdomain.length > 0 )
              ? nano.html `
<label class="btn btn-outline-secondary btn-sm mr-1 mb-0 ${this.data.enabled ? 'active' : '' }">
  <input class="noscript-url-subdomain" data-component="subdomain" type="checkbox" ${ new NoScriptUI.tpl.InputChecked( this.data.enabled ) } ${ new NoScriptUI.tpl.InputDisabled( this.data.disabled ) } />${ this.data.subdomain }.
</label>`
              : '';
          }
        }
        
        , "URLRuleSelectorDomain": class URLRuleSelectorDomain extends nano.tpl
        {
          html()
          {
            return ( this.data.domain.length > 0 )
              ? nano.html `
<label class="btn btn-outline-secondary btn-sm mr-1 mb-0 ${this.data.enabled ? 'active' : '' }">
  <input class="noscript-url-domain" data-component="domain" type="checkbox" ${ new NoScriptUI.tpl.InputChecked( this.data.enabled ) } ${ new NoScriptUI.tpl.InputDisabled( this.data.disabled ) } />${ this.data.domain }
</label>`
              : '';
          }
        }
        
        , "URLRuleSelectorHostname": class URLRuleSelectorHostname extends nano.tpl
        {
          html()
          {
            var rule = this.data["url"].includes('://') ? this.data["url"] : ('://' + this.data["url"]);
            var uri = URI(rule);
            if ( uri.is("IP") )
            {
              var ipData =
              {
                "ip": uri.ip()
                , "enabled": ( this.data["url-components"].indexOf("ip") >= 0 )
                , "disabled": (
                  this.data["url-components"].length == 1
                  && this.data["url-components"].indexOf("ip") >= 0
                  )
              };
              return nano.html `${ new NoScriptUI.tpl.URLRuleSelectorIP( ipData ) }`;              
            }
            var subdomainData =
            {
              "subdomain": uri.subdomain()
              , "enabled": ( this.data["url-components"].indexOf("subdomain") >= 0 )
              , "disabled": (
                this.data["url-components"].length == 1
                && this.data["url-components"].indexOf("subdomain") >= 0
                )
            };
            var domainData =
            {
              "domain": uri.domain()
              , "enabled": (
                this.data["url-components"].indexOf("subdomain") >= 0
                || this.data["url-components"].indexOf("domain") >= 0
                )
              , "disabled": (
                  (
                    this.data["url-components"].length == 1
                    && this.data["url-components"].indexOf("domain") >= 0
                  )
                  ||
                  (
                    this.data["url-components"].indexOf("subdomain") >= 0
                  )
                )
            };
            return nano.html `${ new NoScriptUI.tpl.URLRuleSelectorSubdomain( subdomainData ) }${ new NoScriptUI.tpl.URLRuleSelectorDomain( domainData ) }`;
          }
        }
        
        , "URLRuleSelectorPort": class URLRuleSelectorPort extends nano.tpl
        {
          html()
          {
            return ( this.data.port.length > 0 )
              ? nano.html `
<label class="btn btn-outline-secondary btn-sm mr-1 mb-0 ${this.data.enabled ? 'active' : '' }">
  <input class="noscript-url-port" data-component="port" type="checkbox" ${ new NoScriptUI.tpl.InputChecked( this.data.enabled ) } ${ new NoScriptUI.tpl.InputDisabled( this.data.disabled ) } />:${ this.data.port }
</label>`
              : '';
          }
        }
        
        , "URLRuleSelector": class URLRuleSelector extends nano.tpl
        {
          html()
          {
            var rule = this.data["url"].includes('://') ? this.data["url"] : ('://' + this.data["url"]);
            var uri = URI( rule );
            var schemeData =
            {
              "scheme": uri.scheme()
              , "enabled": ( this.data["url-components"].indexOf("scheme") >= 0 )
              , "disabled": (
                this.data["url-components"].length == 1
                && this.data["url-components"].indexOf("scheme") >= 0
                )
            };
            var usernameData =
            {
              "username": uri.username()
              , "enabled": ( this.data["url-components"].indexOf("username") >= 0 )
              , "disabled": (
                this.data["url-components"].length == 1
                && this.data["url-components"].indexOf("username") >= 0
                )
            };
            var portData =
            {
              "port": uri.port()
              , "enabled": ( this.data["url-components"].indexOf("port") >= 0 )
              , "disabled": (
                this.data["url-components"].length == 1
                && this.data["url-components"].indexOf("port") >= 0
                )
            };
            return nano.html `
<tt class="btn-group" data-toggle="buttons">
${ new NoScriptUI.tpl.URLRuleSelectorScheme( schemeData ) }${ new NoScriptUI.tpl.URLRuleSelectorUsername( usernameData ) }${ new NoScriptUI.tpl.URLRuleSelectorHostname( this.data ) }${ new NoScriptUI.tpl.URLRuleSelectorPort( portData ) }
</tt>`;
          }
        }

        , "Main": class Main extends nano.tpl
        {
          html()
          {
            var output = '';
            if ( Object.keys(this.data.categories.uncategorised).length > 0 )
            {
              var urlData =
              {
                "url": this.data["current-url"]
                , "url-components": NoScriptUI.session["primary-site-components"]
              }
              output += nano.html `
<div class="card bg-warning mt-3" id="noscript-uncategorised">
  <h2 class="card-header">
    <span class="d-flex justify-content-between">
      <span>Uncategorised (Blocked)</span>
      <span id="noscript-primary-rule" data-url="${ this.data["current-url"] }" class="float-right">${ new NoScriptUI.tpl.URLRuleSelector( urlData ) }</span>
    </span>
  </h2>

  <ul class="list-group list-group-flush">
    ${ new NoScriptUI.tpl.UncategorisedItems( this.data ) }
  </ul>
</div>
`;
            }
            
            for ( var accessType in NoScriptUI.const["access-types"])
            {
              if ( Object.keys(this.data.categories[accessType]).length > 0 )
              {
                var data =
                {
                  "current-url": this.data["current-url"]
                  , "access-type": accessType
                  , "style": NoScriptUI.const["access-types"][accessType].style
                  , "urls": this.data.categories[accessType]
                };
                output += nano.html `
<div class="card bg-${ data.style } mt-3 noscript-categorised" data-access="${ accessType }">
  <h2 class="card-header text-white">
    <span class="d-flex justify-content-between">
      <span>${ NoScriptUI.const["access-types"][accessType].description }</span>
      <span class="noscript-forget-all"><button class="btn btn-secondary btn-sm" type="button">Forget All</button></span>
    </span>
  </h2>

  <ul class="list-group list-group-flush">
    ${ new NoScriptUI.tpl.CategorisedItems( data ) }
  </ul>
</div>
`;
              }          
            }
            
            output += nano.html `<pre><code>${ JSON.stringify( NoScriptUI.config, undefined, 2 ) }</code></pre>`;
            
            return output;
          }
        }
      }
      
      , "Run": function( theURL, theResources )
      {
      
        NoScriptUI.session["current-url"] = theURL;
        NoScriptUI.session["resources"] = theResources;
      
        document.getElementById('noscript-page-url').innerHTML = nano.html `${ theURL }`;
        
        if ( ! ("primary-site-components" in NoScriptUI.session) )
        {
          NoScriptUI.session["primary-site-components"] = NoScriptUI.method.GetInitialComponents( theURL );
        }
        if ( ! ("secondary-site-components" in NoScriptUI.session) )
        {
          NoScriptUI.session["secondary-site-components"] = {};
        }
        var categories = NoScriptUI.method.Categorise(theURL, theResources);
        for ( var url in categories["uncategorised"] )
        {
          if ( url in NoScriptUI.session["secondary-site-components"] )
          {
            continue;
          }
          NoScriptUI.session["secondary-site-components"][url] = NoScriptUI.method.GetInitialComponents( url );
        }
        
        var data =
        {
          "current-url": theURL
          , "categories": categories
        };
        
        $('#noscript-main').html(new NoScriptUI.tpl.Main(data).html());
        
        $('#noscript-primary-rule input[type="checkbox"]').change(
          function( )
          {
            var el = $( this );
            var component = el.data('component');
            var parentEl = $('#noscript-primary-rule');
            var index = NoScriptUI.session["primary-site-components"].indexOf(component);
            if ( this.checked )
            {
              if ( index != -1 )
              {
                return false;
              }
              NoScriptUI.session["primary-site-components"].push(component);
            }
            else
            {
              if ( index == -1 )
              {
                return false;
              }
              NoScriptUI.session["primary-site-components"].splice(index, 1);
            }
            var urlData =
            {
              "url": NoScriptUI.session["current-url"]
              , "url-components": NoScriptUI.session["primary-site-components"]
            }
            parentEl.html( new NoScriptUI.tpl.URLRuleSelector( urlData ).html() );
            return false;
          }
        );

        $('#noscript-uncategorised .noscript-secondary-rule input[type="checkbox"]').change(
          function( )
          {
            var el = $( this );
            var component = el.data('component');
            var parentEl = el.parents('.noscript-secondary-rule');
            var secondaryUrl = parentEl.data('url');
            var index = NoScriptUI.session["secondary-site-components"][secondaryUrl].indexOf(component);
            if ( this.checked )
            {
              if ( index != -1 )
              {
                return false;
              }
              NoScriptUI.session["secondary-site-components"][secondaryUrl].push(component);
            }
            else
            {
              if ( index == -1 )
              {
                return false;
              }
              NoScriptUI.session["secondary-site-components"][secondaryUrl].splice(index, 1);
            }
            var urlData =
            {
              "url": secondaryUrl
              , "url-components": NoScriptUI.session["secondary-site-components"][secondaryUrl]
            }
            parentEl.html( new NoScriptUI.tpl.URLRuleSelector( urlData ).html() );
            return false;
          }
        );

        $('.noscript-categorised-item .noscript-toolbar button').click(
          function()
          {
            // disable all buttons to prevent further changes
            $('button').attr("disabled", "disabled");
            // forget checked rules
            if ( ! NoScriptUI.method.ForgetRule( this ) )
            {
              return false;
            }
            
            // reload the page...
            NoScriptUI.Run(
              NoScriptUI.session["current-url"]
              , NoScriptUI.session["resources"]
              );
            return false;
          }
        );

        $('.noscript-categorised .noscript-forget-all button').click(
          function()
          {
            // disable all buttons to prevent further changes
            $('button').attr("disabled", "disabled");
            // forget checked rules
            var el = $(this);
            var categorisedEl = el.parents('.noscript-categorised');
            $('.noscript-toolbar button', categorisedEl).each(
              function()
              {
                if ( ! NoScriptUI.method.ForgetRule( this ) )
                {
                  return false;
                }
                return true;
              }
            );
            
            // reload the page...
            NoScriptUI.Run(
              NoScriptUI.session["current-url"]
              , NoScriptUI.session["resources"]
              );
            return false;
          }
        );

        $('.noscript-uncategorised-item .noscript-toolbar button').click(
          function()
          {
            // disable all buttons to prevent further changes
            $('button').attr("disabled", "disabled");
            var el = $(this);
            var uncategorisedItemEl = el.parents('.noscript-uncategorised-item');
            var accessType = el.data("access");
            var action = el.data("action") === "allow";
            var policy = NoScriptUI.config.policy;
            if ( ! ( accessType in policy ) )
            {
              NoScriptUI.config.policy[accessType] = {};
            }
            var secondaryUrls;
            switch ( accessType )
            {
              case "sites":
                var primaryUrlEl = $('#noscript-primary-rule');
                var primaryUrlComponents = [];
                $('input[type="checkbox"]:checked', primaryUrlEl).each(
                  function()
                  {
                    var el = $(this);
                    primaryUrlComponents.push(el.data('component'));
                  }
                );
                var primaryUrl = NoScriptUI.method.RuleFromComponents(
                    primaryUrlEl.data('url')
                    , primaryUrlComponents
                  );
                var primaryUrls = policy[accessType];
                if ( ! ( primaryUrl in primaryUrls ) )
                {
                  NoScriptUI.config.policy[accessType][primaryUrl] = {};
                }
                
                secondaryUrls = primaryUrls[primaryUrl];
                var secondaryUrlEl = $('.noscript-secondary-rule', uncategorisedItemEl);
                var secondaryUrlComponents = [];
                $('input[type="checkbox"]:checked', secondaryUrlEl).each(
                  function()
                  {
                    var el = $(this);
                    secondaryUrlComponents.push(el.data('component'));
                  }
                );
                var secondaryUrl = NoScriptUI.method.RuleFromComponents(
                    secondaryUrlEl.data('url')
                    , secondaryUrlComponents
                  );
                if ( ! ( secondaryUrl in secondaryUrls ) )
                {
                  NoScriptUI.config.policy[accessType][primaryUrl][secondaryUrl] = {};
                }
                var types = secondaryUrls[secondaryUrl];

                $('.noscript-types input[type="checkbox"]:not(:disabled):checked', uncategorisedItemEl).each(
                  function()
                  {
                    var el = $(this);
                    var type = el.data('type');
                    if ( type in types )
                    {
                      console.log('Found unexpected rule for type: ' + type);
                    }
                    NoScriptUI.config.policy[accessType][primaryUrl][secondaryUrl][type] = action;
                  }
                );
                break;
              case "global":
                secondaryUrls = policy[accessType];
                var secondaryUrlEl = $('.noscript-secondary-rule', uncategorisedItemEl);
                var secondaryUrlComponents = [];
                $('input[type="checkbox"]:checked', secondaryUrlEl).each(
                  function()
                  {
                    var el = $(this);
                    secondaryUrlComponents.push(el.data('component'));
                  }
                );
                var secondaryUrl = NoScriptUI.method.RuleFromComponents(
                    secondaryUrlEl.data('url')
                    , secondaryUrlComponents
                  );
                if ( ! ( secondaryUrl in secondaryUrls ) )
                {
                  NoScriptUI.config.policy[accessType][secondaryUrl] = {};
                }
                var types = secondaryUrls[secondaryUrl];

                $('.noscript-types input[type="checkbox"]:not(:disabled):checked', uncategorisedItemEl).each(
                  function()
                  {
                    var el = $(this);
                    var type = el.data('type');
                    if ( type in types )
                    {
                      console.log('Found unexpected rule for type: ' + type);
                    }
                    NoScriptUI.config.policy[accessType][secondaryUrl][type] = action;
                  }
                );
                break;
              default:
                console.log("Invalid access type encountered. Got " + accessType );
            }
    
            // reload the page...
            NoScriptUI.Run(
              NoScriptUI.session["current-url"]
              , NoScriptUI.session["resources"]
              );
            return false;
          }
        );
      }
    };
    
    // Hooks for various frameworks
    if ( typeof define !== 'undefined' && define.amd )
    {
      // RequireJS
      define(
        []
        , function ()
        {
          return NoScriptUI;
        }
      );
    }
    else if ( typeof module !== 'undefined' && module.exports )
    {
      // CommonJS
      module.exports = NoScriptUI; 
    }
    else
    {
      // <script>
      global.NoScriptUI = NoScriptUI;
    }
  }
)( this );
