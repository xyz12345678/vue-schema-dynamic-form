<style>
.panel {
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid transparent;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    border-color: #ddd;
}

.panel-heading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;

    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}

.panel-body {
    padding: 15px;
}
</style>

<template>
    <div>
        <el-row>
            <el-col :span="10">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <span v-if="jsonValid" class="el-icon-circle-check check-icon"></span>
                        <span v-if="!jsonValid" class="el-icon-circle-close check-icon"></span>
                        Schema</div>
                    <div class="panel-body">
                        <codemirror :value="prettySchema" :options="editorOption" ref="myEditor" @change="codeChangeMethod">
                        </codemirror>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">json data</div>
                    <div class="panel-body">
                       <pre class="model">{{ myData }}</pre>
                    </div>
                </div>
            </el-col>
            <el-col :span="14">
                <Form :schema="jsonschema" v-model="myData" />
                </Form>
            </el-col>
        </el-row>

    </div>
</template>

<script>

import Form from "../src";
import simple from "./samples/simple.js";
import { codemirror } from "vue-codemirror-lite"; //用于写json

require("codemirror/mode/javascript/javascript");
require("codemirror/mode/vue/vue");

require("codemirror/addon/hint/show-hint.js");
require("codemirror/addon/hint/show-hint.css");
require("codemirror/addon/hint/javascript-hint.js");

const fromJson = json => JSON.parse(json);
export default {
    name: "app",
    components: {
        Form,
        codemirror
    },
    data() {
        return {
            editorOption: {
                theme: "default",
                height: "auto",
                viewportMargin: Infinity,
                mode: {
                    name: "javascript",
                    json: true,
                    statementIndent: 2
                },
                lineNumbers: true,
                lineWrapping: true,
                indentWithTabs: false,
                tabSize: 2
            },
            myData: {
                firstName: "天天",
                lastName: "china",
                age: "",
                bio: "",
                password: "",
                telephone: "",
                multipleCheckbox:['daily'],
                agree:true,
                selectarray:['option1News']
            },
            jsonschema: {
                title: "A registration form",
                description: "A simple form example.",
                type: "object",
                required: ["firstName", "lastName"],
                properties: {
                    firstName: {
                        type: "string",
                        title: "First name"
                    },
                    lastName: {
                        type: "string",
                        title: "Last name"
                    },
                    age: {
                        type: "integer",
                        title: "Age",
                        attrs: {
                            min: "1",
                            max: "10"
                        }
                    },
                    bio: {
                        type: "string",
                        title: "Bio"
                    },
                    password: {
                        type: "string",
                        title: "Password",
                        minLength: 3
                    },
                    email: {
                        type: "string",
                        maxLength: 120,
                        title: "Email",
                        default: "demsking@gmail.com",
                        attrs: {
                            type: "email",
                            placeholder: "Your Email"
                        }
                    },
                    telephone: {
                        type: "string",
                        title: "Telephone",
                        minLength: 10
                    },
                    multipleCheckbox: {
                        type: "array",
                        title: "Checkboxes",
                        anyOf: [
                            { value: "daily", label: "Daily News" },
                            { value: "promotion", label: "Promotion" }
                        ],
                        attrs: {
                            type: "checkbox"
                        }
                    },
                    groupedRadio: {
                        type: "array",
                        title: "Frequence",
                        oneOf: [
                            { value: "daily", label: "Daily News" },
                            { value: "weekly", label: "Weekly News" }
                        ],
                        attrs: {
                            type: "radio"
                        }
                    },
                    agree: {
                        type: "boolean",
                        title: "Agree",
                        description:
                            "You agree to receive occasional updates and special offers for vue-json-schema updates.",
                        default: false,
                        attrs: {
                            type: "checkbox"
                        }
                    },
                    selectarray: {
                        type: "array",
                        title: "selectarray",
                        "items":[
                            { value: "option1", label: "option1News" },
                            { value: "option2", label: "option2News" }
                        ],
                        attrs: {
                            type: "select"
                        }
                    }
                },
                submit: {
                    type: "button",
                    title: "提交",
                    attrs: {
                        type: "primary"
                    }
                }
            },
            prettySchema: "" //转变成字符串的json schema
        };
    },
    methods: {
        codeChangeMethod(code) {
            this.prettySchema = code;
            var prettySchema = {};
            try {
                prettySchema = fromJson(code);
                this.jsonValid = true;
                this.jsonschema = Object.assign({}, prettySchema);
            } catch (err) {
                this.jsonValid = false;
            }
        }
    },
    mounted() {
        this.prettySchema = JSON.stringify(this.jsonschema, undefined, 4);
        //this.jsonschema = simple.jsonSchema;
    }
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
