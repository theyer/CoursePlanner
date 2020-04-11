// TODO: Learn some JS best practices because I'm sure it's not this...
//   - Better way to do global calendar obj?
//   - Submit new course as a form?
//   - Hook into elements by ID rather than excessive indexing?
//   - Better way to create initial table?
//   - Maybe use JQuery?

var calendar;  // Global calendar object, created on DOMContentLoaded.
var TIMES = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
    "19:00"];

function getDaysOfWeek(week_checkboxes) {
    var days = []
    // Skip over "label" elements.
    if (week_checkboxes[0].checked) days.push(1);
    if (week_checkboxes[2].checked) days.push(2);
    if (week_checkboxes[4].checked) days.push(3);
    if (week_checkboxes[6].checked) days.push(4);
    if (week_checkboxes[8].checked) days.push(5);
    return days;
}

function createTimeDropdown(id) {
    var dropdown = document.createElement("select");
    if (id != undefined) dropdown.setAttribute('id', id);
    for (let time of TIMES) {
        var option = document.createElement("option");
        option.value = time;
        option.innerHTML = time;
        dropdown.appendChild(option);
    }
    return dropdown;
}

function createLabel(label_text) {
    var label = document.createElement("label");
    label.innerHTML = label_text;
    return label;
}

function createCheckbox(is_checked, is_disabled, id, onclick) {
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (id != undefined) checkbox.setAttribute("id", id);
    if (onclick != undefined) checkbox.setAttribute("onclick", onclick);
    checkbox.disabled = is_disabled;
    checkbox.checked = is_checked;
    return checkbox;
}

function addCourse() {
    var is_displayed = document.getElementById('new_is_displayed').checked;
    var course_name = document.getElementById('new_course_name').value;
    var course_credits = document.getElementById('new_course_credits').value;
    var start_time = document.getElementById('new_start_time').value;
    var end_time = document.getElementById('new_end_time').value;
    var is_monday = document.getElementById('new_monday').checked;
    var is_tuesday = document.getElementById('new_tuesday').checked;
    var is_wednesday = document.getElementById('new_wednesday').checked;
    var is_thursday = document.getElementById('new_thursday').checked;
    var is_friday = document.getElementById('new_friday').checked;

    var table = document.getElementById('course_table');
    var insert_index = table.rows.length - 1;
    var row = table.insertRow(insert_index);

    var is_displayed_cell = row.insertCell(0);
    is_displayed_cell.setAttribute('class', 'is_displayed_col');
    var is_displayed_checkbox = createCheckbox(is_displayed, /*is_disabled*/false, 'is_displayed_' + course_name, 'renderEvents();');
    is_displayed_cell.appendChild(is_displayed_checkbox);

    row.insertCell(1).innerHTML = course_name;
    row.insertCell(2).innerHTML = course_credits;
    row.insertCell(3).innerHTML = start_time;
    row.insertCell(4).innerHTML = end_time;

    var days_cell = row.insertCell(5);
    // Monday
    days_cell.appendChild(createCheckbox(is_monday, /*is_disabled=*/true));
    days_cell.appendChild(createLabel("M"));
    // Tuesday
    days_cell.appendChild(createCheckbox(is_tuesday, /*is_disabled=*/true));
    days_cell.appendChild(createLabel("T"));
    // Wednesday
    days_cell.appendChild(createCheckbox(is_wednesday, /*is_disabled=*/true));
    days_cell.appendChild(createLabel("W"));
    // Thursday
    days_cell.appendChild(createCheckbox(is_thursday, /*is_disabled=*/true));
    days_cell.appendChild(createLabel("Th"));
    // Friday
    days_cell.appendChild(createCheckbox(is_friday, /*is_disabled=*/true));
    days_cell.appendChild(createLabel("F"));

    renderEvents();
}

function clearAllEvents() {
    var events = calendar.getEvents();
    for (let event of events) {
        event.remove();
    }
}

function renderEvents() {
    clearAllEvents();

    var table = document.getElementById('course_table')
    var num_rows = table.rows.length;
    if (num_rows <= 2) return;  // No courses.

    var events = [];
    for (let index = 1; index < num_rows - 1; index++) {
        var row = table.rows[index];
        if (!row.cells[0].firstChild.checked) continue;  // "Displayed" is unchecked.

        var course_name = row.cells[1].innerText;
        var start_time = row.cells[3].innerText;
        var end_time = row.cells[4].innerText;
        var daysOfWeek = getDaysOfWeek(row.cells[5].children);
        events.push({
            id: course_name, 
            title: course_name, 
            startTime: start_time, 
            endTime: end_time, 
            daysOfWeek: daysOfWeek
        });
    }

    for (let event of events) {
        console.log(event);
        calendar.addEvent(event);
    }
    calendar.render();
}

function buildCourseTable() {
    var table = document.createElement("table");
    table.setAttribute('id', 'course_table');

    var header_row = table.insertRow(0);
    header_row.insertCell(0).outerHTML = "<th>Displayed</th>";
    header_row.insertCell(1).outerHTML = "<th>Course Name</th>";
    header_row.insertCell(2).outerHTML = "<th>Credits</th>";
    header_row.insertCell(3).outerHTML = "<th>Start Time</th>";
    header_row.insertCell(4).outerHTML = "<th>End Time</th>";
    header_row.insertCell(5).outerHTML = "<th>Days</th>";

    var new_course_row = table.insertRow(1);
    var displayed_cell = new_course_row.insertCell(0);
    displayed_cell.setAttribute('class', 'is_displayed_col');
    displayed_cell.appendChild(createCheckbox(true, false, 'new_is_displayed'));
    new_course_row.insertCell(1).innerHTML = "<input type='text' id='new_course_name'>";
    new_course_row.insertCell(2).innerHTML = "<input type='text' id='new_course_credits'>";
    new_course_row.insertCell(3).appendChild(createTimeDropdown('new_start_time'));
    new_course_row.insertCell(4).appendChild(createTimeDropdown('new_end_time'));
    var days_cell = new_course_row.insertCell(5);
    // Monday
    days_cell.appendChild(createCheckbox(false, /*is_disabled=*/false, 'new_monday'));
    days_cell.appendChild(createLabel("M"));
    // Tuesday
    days_cell.appendChild(createCheckbox(false, /*is_disabled=*/false, 'new_tuesday'));
    days_cell.appendChild(createLabel("T"));
    // Wednesday
    days_cell.appendChild(createCheckbox(false, /*is_disabled=*/false, 'new_wednesday'));
    days_cell.appendChild(createLabel("W"));
    // Thursday
    days_cell.appendChild(createCheckbox(false, /*is_disabled=*/false, 'new_thursday'));
    days_cell.appendChild(createLabel("Th"));
    // Friday
    days_cell.appendChild(createCheckbox(false, /*is_disabled=*/false, 'new_friday'));
    days_cell.appendChild(createLabel("F"));

    var add_course_button = document.createElement("button");
    add_course_button.setAttribute('onclick', 'addCourse();');
    add_course_button.innerHTML = 'Add Course';

    document.getElementById('course_list').appendChild(table);
    document.getElementById('course_list').appendChild(document.createElement("br"));
    document.getElementById('course_list').appendChild(add_course_button);
}

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['timeGrid'],
        defaultView: 'timeGridWeek',
        header: false,
        footer: false,
        aspectRatio: 1.5,
        height: "auto",
        columnHeaderFormat: { weekday: 'long' },
        allDaySlot: false,
        // TODO: set min/max dynamically?
        minTime: '07:00:00',
        maxTime: '19:00:00',
        // Set "today" to a weekend, then hide weekends to avoid highlighting today.
        now: '2020-04-05',
        weekends: false,
    });
    calendar.render();

    buildCourseTable();
});