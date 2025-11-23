import data from './data.json'

export function getAllProjects() {
    return data.projects;
}

export function getProject(slug) {
	return data.projects.find(p => p.slug === slug);
}