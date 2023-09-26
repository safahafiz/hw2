/**
 * Given an array of students, generates HTML for all students
 * using {@link buildStudentHtml}.
 * 
 * @param {*} studs array of students
 * @returns html containing all students
 */
function buildStudentsHtml(studs) {
	let html = '<div class="row">'; 
  
	studs.forEach(stud => {
	  html += '<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">';
	  html += buildStudentHtml(stud);
	  html += '</div>';
	});
  
	html += '</div>';
	return html;
  }
  
  
  /**
 * Given a student object, generates HTML. Use innerHtml to insert this
 * into the DOM, we will talk about security considerations soon!
 * 
 * @param {*} stud 
 * @returns 
 */
  	function buildStudentHtml(stud) {
	let html = '<div class="student">';
	html += `<h3>${stud.name.first} ${stud.name.last}</h2>`;
	html += `<p> <strong>Major: ${stud.major}</strong> <strong> Credits: ${stud.numCredits}</strong></p>`;
	html += `<p>Are they from WI? ${stud.fromWisconsin ? 'Yes' : 'No'}</p>`;
	html += `<p>Their ${stud.interests.length} hobbies: </p>`;

	
	if (stud.interests && stud.interests.length > 0) {
	  html += '<ul>';
	  stud.interests.forEach(interest => {
		html += `<li>${interest}</li>`;
	  });
	  html += '</ul>';
	} else {
	  html += '<p><strong>No interests</strong></p>';
	}
	
	html += '</div>';
	return html;
  }
  
  function handleSearch(e) {
	e.preventDefault();
	const name = document.getElementById("search-name").value.trim().toLowerCase();
	const interests = document.getElementById("search-interest").value.trim().toLowerCase();
	const major = document.getElementById("search-major").value.trim().toLowerCase();
	const filter = studentData.filter(student => {
	  const fullStudentName = `${student.name.first} ${student.name.last}`.toLowerCase();
	  if (major && !student.major.toLowerCase().includes(major)) 
		return false;
	  if (name && !fullStudentName.includes(name)) 
		return false;
	  if (interests) {
		const interestMatch = student.interests.some(interest =>
		  interest.toLowerCase().includes(interests)
		);
		if (!interestMatch) 
		  return false;
	  }
	  return true;
	});
	const studentsHtml = buildStudentsHtml(filter);
	const studentContainer = document.getElementById("students");
	studentContainer.innerHTML = studentsHtml;
	const Results = document.getElementById("num-results");
	Results.innerText = filter.length;
  }
  
  document.getElementById("search-btn").addEventListener("click", handleSearch);
  
  
  fetch("https://cs571.org/api/f23/hw2/students", {
	headers: {
	  "X-CS571-ID": CS571.getBadgerId()
	}
  })
	.then(response => {
	  if (response.ok) {
		return response.json();
	  } else {
		throw new Error("Failed to fetch student data.");
	  }
	})
	.then(data => {
	
	  studentData = data;
	  console.log(data);
	  const Results = document.getElementById("num-results");
	  Results.innerText = data.length; 
	  const studentsHtml = buildStudentsHtml(data);
  
	  const studentsDiv = document.getElementById("students");
	  studentsDiv.innerHTML = studentsHtml;
	})
	.catch(error => {
	  console.error("An error occurred:", error);
	});
  