"use server";

import { JSDOM } from "jsdom";

export type CourseInfo = {
  name: string;
  courseContent: string;
  learningGoal: string;
  learningMethod: string;
  studyLevel?: string;
  subjects?: string[];
  language?: string;
};

/**
 * Fetches information about a specific course from NTNU's website.
 *
 * @param courseCode The course code to fetch information for.
 * @returns A promise that resolves to a CourseInfo object containing details of the course.
 *          Returns null if course information cannot be found.
 */
export async function getCourseInfo(
  courseCode: string
): Promise<CourseInfo | null> {
  // const url = `https://www.ntnu.no/studier/emner/${courseCode}#tab=omEmnet`;
  const url = `https://www.ntnu.edu/studies/courses/${courseCode}#tab=omEmnet`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const html = await res.text();

  const dom = new JSDOM(html);

  // Get name
  let name =
    dom.window.document.querySelector("#course-details h1")?.textContent;

  // Get main content info
  const courseContent = dom.window.document.getElementById(
    "course-content-toggler"
  )?.textContent;
  const learningGoal = dom.window.document.getElementById(
    "learning-goal-toggler"
  )?.textContent;
  const learningMethod = dom.window.document.getElementById(
    "learning-method-toggler"
  )?.textContent;

  if (!courseContent || !learningGoal || !learningMethod || !name) {
    console.warn("No course info found");
    return null;
  }

  // Remove course code prefix in name
  const cutoff = name.indexOf("-");
  name = name.slice(cutoff + 1);

  // Get the study level and language
  const cardps = dom.window.document.querySelectorAll(".card-body p");

  let studyLevel = undefined;
  let language = undefined;

  for (const cardp of cardps) {
    const text = cardp.textContent;
    if (!text) continue;

    if (text.includes("Study level:")) {
      const studyLevelIndex =
        text.indexOf("Study level:") + "Study level:".length;

      studyLevel = text.slice(studyLevelIndex).trim();
    } else if (text.includes("Language of instruction:")) {
      const languageIndex =
        text.indexOf("Language of instruction:") +
        "Language of instruction:".length;

      language = text.slice(languageIndex).trim();
    }
  }

  // Get the subject/s
  const listElements =
    dom.window.document.getElementsByClassName("subject-area-list")[0].children;
  let subjects = [];
  for (const listElement of listElements) {
    subjects.push(listElement.textContent as string);
  }

  // The Regex below removes repeated whitespace in text
  return {
    name: name.trim(),
    courseContent: courseContent.replace(/\s+/g, " ").trim(),
    learningGoal: learningGoal.replace(/\s+/g, " ").trim(),
    learningMethod: learningMethod.replace(/\s+/g, " ").trim(),
    studyLevel: studyLevel,
    subjects: subjects,
    language: language,
  };
}
