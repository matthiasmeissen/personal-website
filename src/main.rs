
use std::{fs, path::Path};
use pulldown_cmark;
use tera::{Context, Tera};

fn main() {
    let content_path = "src/content/test.md";
    let style_path = "src/styles/global.css";
    let output_dir = "dist";

    // Clear and create output dir
    if Path::new(output_dir).exists() {
        fs::remove_dir_all(output_dir).expect("Failed to clear output directory.");
    }
    fs::create_dir_all(output_dir).expect("Failed to create dist directory.");

    // Read md file, convert to html and insert into template
    let md_file = read_md_file(content_path);
    let raw_html = md_to_html(&md_file);
    let final_html = html_to_template(&raw_html, "index.html");

    // Create new html file in output dir
    fs::write(format!("{output_dir}/index.html"), final_html).expect("Could not write html file.");

    // Copy styles to output dir
    fs::copy(style_path, format!("{output_dir}/global.css")).expect("Could not copy css file.");
}

fn read_md_file(input_path: &str) -> String {
    fs::read_to_string(input_path).expect("Could not read md file")
}

fn md_to_html(md: &str) -> String {
    let parser = pulldown_cmark::Parser::new(md);
    let mut html_output = String::new();
    pulldown_cmark::html::push_html(&mut html_output, parser);
    html_output
}

fn html_to_template(input_html: &str, html_template: &str) -> String {
    let tera = Tera::new("src/templates/**/*.html").unwrap();

    let mut context = Context::new();
    context.insert("content", &input_html);

    tera.render(html_template, &context).unwrap()
}
