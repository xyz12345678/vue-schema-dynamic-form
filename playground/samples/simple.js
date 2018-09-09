module.exports = {
    jsonSchema: {
        "title": "A registration form",
        "description": "A simple form example.",
        "type": "object",
        "required": [
            "firstName",
            "lastName"
        ],
        "properties": {
            "name": {
                "type": "string",
                "minLength": 8,
                "maxLength": 80,
                "title": "Full Name",
                "pattern": "^(.*)$",
                "attrs": {
                  "placeholder": "Your Full Name",
                }
              },
              "email": {
                "type": "string",
                "maxLength": 120,
                "title": "Email",
                "default": "demsking@gmail.com",
                "attrs": {
                  "type": "email",
                  "placeholder": "Your Email",
                }
              },
              "lists": {
                "type": "string",
                "title": "List",
                "enum": ["Daily New", "Promotion"],
                "attrs": {
                  "placeholder": "Select your list subscription",
                  "readonly":true,
                }
              },
              "source": {
                "type": "string",
                "maxLength": 120,
                "title": "Source",
                "description": "Ex. Using the NPM Search Engine",
                "attrs": {
                  "type": "textarea",
                  "placeholder": "How did you hear about us?"
                }
              },
              "password": {
                "type": "string",
                "title": "password",
                "default": "hello",
                "attrs": {
                  "type": "password"
                }
              },
              "aList": {
                "type": "array",
                "title": "Array field",
                "minItems": 2,
                "maxItems": 5,
                "items": {
                  "type": "string"
                },
                "attrs": {
                  "typeX": "password"
                }
              },
              "regex": {
                "type": "string",
                "title": "regex",
                "pattern": "[a-e]+"
              },
              "multipleCheckbox": {
                "type": "array",
                "title": "Checkboxes",
                "anyOf": [
                  { "value": "daily", "label": "Daily News" },
                  { "value": "promotion", "label": "Promotion" }
                ]
              },
              "groupedRadio": {
                "type": "array",
                "title": "Frequence",
                "oneOf": [
                  { "value": "daily", "label": "Daily News" },
                  { "value": "weekly", "label": "Weekly News" }
                ]
              },
              "agree": {
                "type": "boolean",
                "title": "Agree",
                "description": "You agree to receive occasional updates and special offers for vue-json-schema updates.",
                "default": false,
                "attrs": {
                  "type": "checkbox"
                }
            }
        }
    }
}