
const goalPage = dv.page(input.file);
const projects = goalPage
    .file
    .inlinks
    .where((p) => {
        const mp = dv.page(p.path);
        return mp.tags?.contains("project") && mp.status === "In Progress";
    });

const totalTasksGoalPage = goalPage.file.lists.where(t => t.task).length;
const totalTasksInProjects = projects.values.reduce((acc, p) => {
    const mp = dv.page(p.path);
    return acc + mp.file.lists.where(t => t.task).length;
}, 0);

const finishedTasksGoalPage = goalPage.file.lists.where(t => t.task && t.status === 'x').length;
const finishedTasksInProjects = projects.values.reduce((acc, p) => {
    const mp = dv.page(p.path);
    return acc + mp.file.lists.where(t => t.task && t.status === 'x').length;
}, 0);

const Target = totalTasksGoalPage + totalTasksInProjects;
const Progress = finishedTasksGoalPage + finishedTasksInProjects;
console.log(totalTasksInProjects, finishedTasksInProjects);

const containerEl = createDiv();
Object.assign(containerEl.style, {
    'display': 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    'justify-content': 'center',
});

const max = Target || 0;
const value = Progress || 0;
const percent = Math.round((value / max) * 100) || 0;

const progressBar = containerEl.createEl('progress');
Object.assign(progressBar, {max, value});

const progressText = containerEl.createEl('div');
Object.assign(progressText, {
    'textContent': `${percent}% completed`,
});

dv.paragraph(containerEl)