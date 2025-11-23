
use std::fs;
use pulldown_cmark;
use tera::{Context, Tera};

fn main() {

    let mut tera = Tera::new("src/templates/**/*.html").unwrap();
    tera.add_raw_template("test_template", "Hello, {{ content }}!").unwrap();

    let html_output = file_to_html("src/content/test.md");

    let mut context = Context::new();
    context.insert("content", &html_output);

    let page = tera.render("test_template", &context).unwrap();
    let page1 = tera.render("test.html", &context).unwrap();

    println!("
        Raw HTML: {}
        \nInline Template: {} 
        \nExternal Template: {}", 
        html_output, page, page1
    );
}

fn md_to_html(md: &str) -> String {
    let parser = pulldown_cmark::Parser::new(md);
    let mut html_output = String::new();
    pulldown_cmark::html::push_html(&mut html_output, parser);
    html_output
}

fn file_to_html(input_path: &str) -> String {
    let md_file = fs::read_to_string(input_path).expect("Could not read file");
    md_to_html(&md_file)
}
