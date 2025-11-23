
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

    process_file("test.md", "test.html", &tera);

    process_file("index.html", "index.html", &tera);

    copy_css_files("global.css");
}


// Markdown to html

fn md_to_html(md: &str) -> String {
    let parser = pulldown_cmark::Parser::new(md);
    let mut html_output = String::new();
    pulldown_cmark::html::push_html(&mut html_output, parser);
    html_output
}

fn inject_into_template(input: &str, html_template: &str, tera: &Tera) -> String {
    let mut context = Context::new();
    context.insert("content", &input);

    tera.render(html_template, &context).unwrap()
}

fn process_file(filename: &str, output_name: &str, tera: &Tera) {
    let input_path = format!("{}/{}", CONTENT_DIR,filename);

    let file_content = fs::read_to_string(&input_path).expect(&format!("Failed to read {}", input_path));

    let final_content = if filename.ends_with(".md") {
        md_to_html(&file_content)
    } else {
        file_content
    };

    let final_page = inject_into_template(&final_content, "base.html", tera);

    fs::write(format!("{}/{}", OUTPUT_DIR, output_name), final_page).expect("Could not write output file.")
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
