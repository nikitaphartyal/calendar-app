//Function to save user progress in local storage
//Here progress refers to the amount of scroll y position of the page for each subtopic of topic in a course.
export function saveProgress(course:string,topicId: number, subtopicId: number, progress: number) {
    const progressData = localStorage.getItem(course) || "{}";
    const data = JSON.parse(progressData);
    data[topicId] = data[topicId] || {};
    data[topicId][subtopicId] = progress;
    localStorage.setItem(course, JSON.stringify(data));
}

//Get user progress from local storage
export function getProgress(course:string,topicId: number, subtopicId: number) {
    const progressData = localStorage.getItem(course) || "{}";
    const data = JSON.parse(progressData);
    return data[topicId]?.[subtopicId] || 0;
}