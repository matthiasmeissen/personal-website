
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct Work {
    title: String,
    slug: String,
    details: String,
    markdown: String,
}

fn main() {
    let work1 = Work {
        title: "Project 1 Title".into(),
        slug: "project1".into(),
        details: "Some Details".into(),
        markdown: "#Title \nSome other things.".into(),
    };

    let filepath = "export/data.json";
    let json = serde_json::to_string_pretty(&work1).unwrap();
    std::fs::write(filepath, json).unwrap();
    println!("Data saved to {}", filepath);
}
