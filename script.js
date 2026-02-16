const storageKeys = {
  jobs: "talentbridge_jobs",
  resumes: "talentbridge_resumes",
};

function load(key) {
  return JSON.parse(localStorage.getItem(key) ?? "[]");
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function renderCards(container, items, renderer) {
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = '<p class="empty">暂无数据，先提交一条吧。</p>';
    return;
  }

  for (const item of items) {
    const card = document.createElement("article");
    card.className = "item";
    card.innerHTML = renderer(item);
    container.append(card);
  }
}

function init() {
  const jobForm = document.getElementById("jobForm");
  const resumeForm = document.getElementById("resumeForm");
  const jobList = document.getElementById("jobList");
  const resumeList = document.getElementById("resumeList");

  let jobs = load(storageKeys.jobs);
  let resumes = load(storageKeys.resumes);

  const render = () => {
    renderCards(
      jobList,
      jobs,
      (job) => `
        <h3>${job.title}</h3>
        <p class="meta">预算：¥${Number(job.budget).toLocaleString()} · 技能：${job.skills}</p>
        <p>${job.description}</p>
      `,
    );

    renderCards(
      resumeList,
      resumes,
      (resume) => `
        <h3>${resume.name} · ${resume.role}</h3>
        <p class="meta">技能：${resume.skills}</p>
        <p>${resume.summary}</p>
      `,
    );
  };

  jobForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(jobForm);

    const newJob = {
      title: formData.get("title")?.toString().trim(),
      budget: formData.get("budget")?.toString().trim(),
      skills: formData.get("skills")?.toString().trim(),
      description: formData.get("description")?.toString().trim(),
    };

    jobs = [newJob, ...jobs];
    save(storageKeys.jobs, jobs);
    jobForm.reset();
    render();
  });

  resumeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(resumeForm);

    const newResume = {
      name: formData.get("name")?.toString().trim(),
      role: formData.get("role")?.toString().trim(),
      skills: formData.get("skills")?.toString().trim(),
      summary: formData.get("summary")?.toString().trim(),
    };

    resumes = [newResume, ...resumes];
    save(storageKeys.resumes, resumes);
    resumeForm.reset();
    render();
  });

  document.getElementById("clearJobs").addEventListener("click", () => {
    jobs = [];
    save(storageKeys.jobs, jobs);
    render();
  });

  document.getElementById("clearResumes").addEventListener("click", () => {
    resumes = [];
    save(storageKeys.resumes, resumes);
    render();
  });

  render();
}

init();
