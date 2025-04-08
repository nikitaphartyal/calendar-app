import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { LanguageSupport } from "@codemirror/language";
export interface Language{
  codemirror:LanguageSupport,
  language_id:number,
  name:string
}


export const languages: Record<string, Language> = {
    javascript: {
      codemirror:javascript(),
      language_id:63,
      name:"javascript"
    },
    python: {
      codemirror:python(),
      language_id:71,
      name:"python"
    },
    cpp: {
      codemirror:cpp(),
      language_id:54,
      name:"cpp"
    },
    java: {
      codemirror:java(),
      language_id:62,
      name:"java"
    },
  };