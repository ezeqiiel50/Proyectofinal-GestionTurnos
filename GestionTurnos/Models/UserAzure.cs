﻿using Newtonsoft.Json;

namespace GestionTurnos.Models
{
    public class UserAzure
    {
        [JsonProperty("@odata.context")]
        public string odatacontext { get; set; }
        public List<Value> value { get; set; }
    }

    public class Value
    {
        public List<string> businessPhones { get; set; }
        public string displayName { get; set; }
        public string givenName { get; set; }
        public string jobTitle { get; set; }
        public string mail { get; set; }
        public string mobilePhone { get; set; }
        public string officeLocation { get; set; }
        public string preferredLanguage { get; set; }
        public string surname { get; set; }
        public string userPrincipalName { get; set; }
        public string id { get; set; }
    }

}
