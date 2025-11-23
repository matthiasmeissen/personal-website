
use std::{fs, path::Path};
use pulldown_cmark;
use tera::{Context, Tera};


const CONTENT_DIR: &str = "src/content";
const STYLE_DIR: &str = "src/styles";
const OUTPUT_DIR: &str = "dist";
const TEMPLATE_DIR: &str = "src/templates/**/*.html";


fn main() {
    let tera = Tera::new(TEMPLATE_DIR).unwrap();

    prepare_output_dir();

    process_md_to_html_file("test.md", "index.html", "index.html", &tera);

    copy_css_files("global.css");
}


// Markdown to html

fn read_md_file(input_path: &str) -> String {
    fs::read_to_string(input_path).expect("Could not read md file")
}

fn md_to_html(md: &str) -> String {
    let parser = pulldown_cmark::Parser::new(md);
    let mut html_output = String::new();
    pulldown_cmark::html::push_html(&mut html_output, parser);
    html_output
}

fn html_to_template(input_html: &str, html_template: &str, tera: &Tera) -> String {
    let mut context = Context::new();
    context.insert("content", &input_html);

    tera.render(html_template, &context).unwrap()
}

fn process_md_to_html_file(file_name: &str, template_name: &str, target_name: &str, tera: &Tera) {
    let md_file = read_md_file(format!("{CONTENT_DIR}/{file_name}").as_str());
    let raw_html = md_to_html(&md_file);
    let final_html = html_to_template(&raw_html, template_name, tera);

    fs::write(format!("{OUTPUT_DIR}/{target_name}"), final_html).expect("Could not write html file.");
}


// Utilities

fn prepare_output_dir() {
    if Path::new(OUTPUT_DIR).exists() {
        fs::remove_dir_all(OUTPUT_DIR).expect("Failed to clear output directory.");
    }
    fs::create_dir_all(OUTPUT_DIR).expect("Failed to create dist directory.");
}

fn copy_css_files(file_name: &str) {
    let source = format!("{STYLE_DIR}/{file_name}");
    let dest = format!("{OUTPUT_DIR}/{file_name}");
    fs::copy(source, dest).expect("Could not copy css file.");
}
