var timeDisplayEl = $('#time-display');
var projectDisplayEl = $("#project-display");
var projectFormEl = $('#project-form');
var projectNameInputEl = $('#project-name-input');
var projectTypeInputEl = $('#project-type-input');
var projectDateInputEl = $('#project-date-input');


function displayTime() {
    var now = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
    timeDisplayEl.text(now);
}

function saveProjectsToStorage(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function readProjectsFromStorage(){
    var projects = localStorage.getItem('projects');
    if (projects) {
        projects = JSON.parse(projects);
      } else {
        projects = [];
      }
      return projects;
}

function handleProjectFormSubmit(event) {
    event.preventDefault();

    var projectName = projectNameInputEl.val().trim();
    var projectType = projectTypeInputEl.val();
    var projectDate = projectDateInputEl.val();
    console.log ('projectName',projectName)

    var newProject = {
        name: projectName,
        type: projectType,
        date: projectDate,
    };

    var projects = readProjectsFromStorage();
    projects.push(newProject);
    console.log ('project', projects)

    saveProjectsToStorage(projects);

    printProjectData();
    projectNameInputEl.val('');
    projectTypeInputEl.val('');
    projectDateInputEl.val('');
}


function printProjectData(){
    projectDisplayEl.empty();
    var projects = readProjectsFromStorage();
    console.log ("project1",projects)

    for (var i = 0; i < projects.length; i += 1) {
        var project = projects[i];
        var projectDate = dayjs(project.date);
        var today = dayjs().startOf('day');

        var rowEl = $('<tr>');
        var nameEL = $('<td>').text(project.name);
        var typeEl = $('<td>').text(project.type);
        var dateEl = $('<td>').text(projectDate.format('MM/DD/YYYY'));

        var deleteEl = $(
            '<td><button class="btn btn-sm btn-delete-project" data-index="' +
            i +
            '">X</button></td>'
        );

        if (projectDate.isBefore(today)) {
            rowEl.addClass('project-late');
        } else if (projectDate.isSame(today)) {
            rowEl.addClass('project-today');
        }
        
        rowEl.append(nameEL, typeEl, dateEl, deleteEl);
        projectDisplayEl.append(rowEl);
    }
}

function handleDeleteProject(){
    var projectIndex = parseInt($(this).attr('data-index'));
    var projects = readProjectsFromStorage();
    projects.splice(projectIndex,1);
    saveProjectsToStorage(projects);

  // print projects
    printProjectData();
}

projectFormEl.on('submit', handleProjectFormSubmit);
projectDisplayEl.on('click','.btn-delete-project', handleDeleteProject);

displayTime();
setInterval(displayTime, 1000);

printProjectData();
