// Dynamic content for the resume sections
// Data will be loaded from MongoDB via backend API for logged-in users

// Default template data - used for logged-out users or when no user data exists
const defaultResumeData = {
  About: {
    title: 'About',
    panelId: 'about-panel',
    htmlContent: `
      <p>Hi, I'm Yash Agarwal, a second-year Bachelor of Technology student in Computer Science and Engineering
      (Honors in Machine Learning & Artificial Intelligence) at Graphic Era Hill University.</p>
      <p>I specialize in full-stack web development, data structures & algorithms, and machine learning projects.
      I enjoy reading books, watching anime, and building innovative tech solutions in my free time.</p>`,
    media: { type: null, src: null, filename: null },
    scrollPos: 0.15,
    color: 0xFF6347
  },
  Skills: {
    title: 'Skills',
    panelId: 'skills-panel',
    htmlContent: `
      <h3>Languages</h3>
      <p>JavaScript, TypeScript, Python, C++, HTML5, CSS3</p>
      <h3>Frameworks & Libraries</h3>
      <p>React, Vite, Node.js, Express, BeautifulSoup</p>
      <h3>Tools & Technologies</h3>
      <p>Git, Docker, AWS, Vercel, Render, PostgreSQL, MongoDB</p>
      <h3>Specializations</h3>
      <p>Web Development, Data Structures & Algorithms, Machine Learning,
      Interactive Experiences, Performance Optimization</p>`,
    media: { type: null, src: null, filename: null },
    scrollPos: 0.30,
    color: 0x6495ED
  },
  Experience: {
    title: 'Experience',
    panelId: 'experience-panel',
    htmlContent: `
      <h3>Software Engineer Intern - [Your Company]</h3>
      <p>May 2024 - July 2024</p>
      <ul>
        <li>Developed features for a web application using React and Node.js.</li>
        <li>Collaborated with cross-functional teams to design RESTful APIs.</li>
        <li>Wrote unit tests and improved code coverage by 20%.</li>
      </ul>
      <h3>Undergraduate Research Assistant - Wikipedia Link Rule Project</h3>
      <p>January 2025 - Present</p>
      <ul>
        <li>Built a parser with BeautifulSoup to traverse Wikipedia articles.
        Eliminated reliance on Selenium for faster performance.</li>
        <li>Implemented a machine learning model to predict first links and
        probability of reaching the "Philosophy" page.</li>
        <li>Deployed full-stack application using Vercel (frontend) and Render (backend).</li>
      </ul>`,
    media: { type: null, src: null, filename: null },
    scrollPos: 0.50,
    color: 0x9ACD32
  },
  Projects: {
    title: 'Projects',
    panelId: 'projects-panel',
    htmlContent: `
      <h3>Wikipedia's First Link Rule</h3>
      <p>Created a web application that navigates Wikipedia articles based on
      predefined rules to determine if they reach the "Philosophy" article.
      Technologies: JavaScript, BeautifulSoup, Node.js.</p>
      <h3>ML-Augmented Link Predictor</h3>
      <p>Designed and trained a machine learning pipeline to predict the first
      link of any Wikipedia page and its path convergence probability.</p>
      <h3>Personal Portfolio Website</h3>
      <p>Developed a Vite + React site showcasing my projects, blog,
      and technical tutorials. Integrated Bedrock Passport and Vercel Analytics.</p>`,
    media: { type: null, src: null, filename: null },
    scrollPos: 0.70,
    color: 0xDA70D6
  },
  Education: {
    title: 'Education',
    panelId: 'education-panel',
    htmlContent: `
      <h3>Bachelor of Technology in Computer Science & Engineering</h3>
      <p>Graphic Era Hill University | 2023 - Present</p>
      <p>Honors in Machine Learning & Artificial Intelligence</p>`,
    media: { type: null, src: null, filename: null },
    scrollPos: 0.85,
    color: 0xFFA500
  }
};

// Active resume data - starts with default, gets overridden with user data
export let resumeSectionsData = { ...defaultResumeData };

// API Integration functions
export async function loadUserResumeData() {
  try {
    // Check if user is logged in
    const loginBridge = new window.LoginBridge();
    if (!loginBridge.isLoggedIn()) {
      console.log('User not logged in, using default template');
      return false;
    }

    const token = loginBridge.getToken();
    const backendUrl = 'http://localhost:8080';
    
    const response = await fetch(`${backendUrl}/api/resumes/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 404) {
      console.log('No user resume found, using default template');
      return false;
    }

    if (!response.ok) {
      throw new Error(`Failed to load resume: ${response.status}`);
    }

    const resumeData = await response.json();
    console.log('📄 Loaded user resume from MongoDB:', resumeData);
    
    // Update resumeSectionsData with user's data
    updateResumeDataFromBackend(resumeData);
    return true;
    
  } catch (error) {
    console.error('Error loading user resume data:', error);
    return false;
  }
}

function updateResumeDataFromBackend(backendData) {
  // Map backend resume data to frontend sections
  const dataMapping = {
    'About': backendData.aboutMe,
    'Skills': getContentFromField(backendData.skills),
    'Experience': getContentFromField(backendData.experience),
    'Projects': getContentFromField(backendData.projects),
    'Education': getContentFromField(backendData.education)
  };

  Object.entries(dataMapping).forEach(([sectionTitle, content]) => {
    if (content && resumeSectionsData[sectionTitle]) {
      // Update the HTML content while preserving other properties
      resumeSectionsData[sectionTitle].htmlContent = formatContentAsHTML(content);
      console.log(`📝 Updated ${sectionTitle} with user data`);
    }
  });
}

function getContentFromField(field) {
  if (typeof field === 'string') {
    return field;
  } else if (typeof field === 'object' && field !== null) {
    return field.content || Object.values(field).join('\n');
  }
  return null;
}

function formatContentAsHTML(content) {
  // Convert plain text content to basic HTML format
  if (!content) return '';
  
  // If it's already HTML, return as-is
  if (content.includes('<')) {
    return content;
  }
  
  // Convert line breaks to paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
}

export function getSectionData(title) {
  return resumeSectionsData[title];
}

export function updateSectionTextContent(sectionTitle, newText) {
  if (resumeSectionsData[sectionTitle]) {
    const panelContentElement = document.querySelector(`#${resumeSectionsData[sectionTitle].panelId} .panel-content`);
    const textInputElement = document.getElementById(`${sectionTitle.toLowerCase()}-text-input`);

    if (newText.trim() !== "") {
      if (panelContentElement) {
        const firstP = panelContentElement.querySelector('p');
        if (firstP) {
          firstP.textContent = newText;
        } else {
          panelContentElement.innerHTML = `<p>${newText}</p>`;
        }
        resumeSectionsData[sectionTitle].htmlContent = panelContentElement.innerHTML;
      }
    }

    if (textInputElement) textInputElement.value = "";

    console.log(`Text content for ${sectionTitle} updated.`);
    document.dispatchEvent(new CustomEvent('resumeDataUpdated', { detail: { sectionTitle, type: 'text' } }));
  } else {
    console.warn(`Section ${sectionTitle} not found in resumeSectionsData.`);
  }
}

export function updateSectionMediaContent(sectionTitle, mediaType, mediaSrc, filename) {
  if (resumeSectionsData[sectionTitle]) {
    resumeSectionsData[sectionTitle].media = { type: mediaType, src: mediaSrc, filename: filename };
    console.log(`Media content for ${sectionTitle} updated: ${mediaType} - ${filename}`);
    document.dispatchEvent(new CustomEvent('resumeDataUpdated', { detail: { sectionTitle, type: 'media' } }));
  } else {
    console.warn(`Section ${sectionTitle} not found in resumeSectionsData.`);
  }
}

// Reset to default data - useful for logout
export function resetToDefaultData() {
  resumeSectionsData = { ...defaultResumeData };
  console.log('📄 Reset to default resume template');
}