// Global variables
let token = localStorage.getItem('auth_token');
const API_KEY = 're98wr6ew8r6rew76r89e6rwer6w98r6ywe9r6r6w87e9wr6ew06r7'; 

// DOM Elements
const loginSection = document.getElementById('login-section');
const editorSection = document.getElementById('editor-section');
const exerciseFormContainer = document.getElementById('exercise-form-container');
const exerciseList = document.getElementById('exercise-list');
const formTitle = document.getElementById('form-title');
const exerciseIdInput = document.getElementById('exercise-id');
const titleInput = document.getElementById('title');
const instructionsInput = document.getElementById('instructions');
const testFileInput = document.getElementById('test-file');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const deleteBtn = document.getElementById('delete-btn');
const formMessage = document.getElementById('form-message');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const refreshExercisesBtn = document.getElementById('refresh-exercises-btn');
const newExerciseBtn = document.getElementById('new-exercise-btn');
const groupSelect = document.getElementById('group-select');

// Check if user is logged in
function checkAuth()
{
    if (token)
    {
        loginSection.classList.add('hidden');
        editorSection.classList.remove('hidden');
        fetchExercises();
    } else
    {
        loginSection.classList.remove('hidden');
        editorSection.classList.add('hidden');
    }
}

// Login function
async function login()
{
    const username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    password = CryptoJS.MD5(password).toString();

    if (!username || !password)
    {
        showLoginError('Please enter username and password');
        return;
    }

    try
    {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.status === 'success')
        {
            token = data.token;
            localStorage.setItem('auth_token', token);
            checkAuth();
        } else
        {
            showLoginError(data.message || 'Login failed');
        }
    } catch (error)
    {
        showLoginError('An error occurred during login');
        console.error(error);
    }
}

// Logout function
function logout()
{
    token = null;
    localStorage.removeItem('auth_token');
    checkAuth();
}

// Show login error
function showLoginError(message)
{
    loginError.textContent = message;
    loginError.classList.remove('hidden');
}

// Fetch all exercises
async function fetchExercises()
{
    try
    {
        const response = await fetch('/exercises', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-API-KEY': API_KEY
            }
        });
        const data = await response.json();
        if (data.status === 'success')
        {
            displayExercises(data.exercises);
            populateGroupSelect(data.groups);
        } else
        {
            console.error('Failed to fetch exercises:', data.message);
        }
    } catch (error)
    {
        console.error('Error fetching exercises:', error);
    }
    function populateGroupSelect(groups)
    {
        groupSelect.innerHTML = '';
        if (!groups) return;
        groups.forEach(group =>
        {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            groupSelect.appendChild(option);
        });
    }
}

function populateGroupSelect(groups)
{
    groupSelect.innerHTML = '';
    if (!groups) return;
    groups.forEach(group =>
    {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.name;
        groupSelect.appendChild(option);
    });
}

// Display exercises in the list
function displayExercises(exercises)
{
    exerciseList.innerHTML = '';
    exercises.forEach(exercise =>
    {
        const li = document.createElement('li');
        li.textContent = `${exercise.id}. ${exercise.title}`;
        li.dataset.id = exercise.id;
        li.addEventListener('click', () => fetchExercise(exercise.id));
        exerciseList.appendChild(li);
    });
}

// Fetch a specific exercise
async function fetchExercise(id)
{
    try
    {
        const response = await fetch(`/exercises/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-API-KEY': API_KEY
            }
        });
        const data = await response.json();
        if (data.status === 'success')
        {
            displayExerciseForm(data.exercise, data.groups);
        } else
        {
            console.error('Failed to fetch exercise:', data.message);
        }
    } catch (error)
    {
        console.error('Error fetching exercise:', error);
    }
}

// Display the exercise form with data
function displayExerciseForm(exercise = null)
{
    // If groups are provided, update the select
    if (arguments.length > 1 && arguments[1])
    {
        populateGroupSelect(arguments[1]);
    }
    if (exercise)
    {
        formTitle.textContent = 'Edit Exercise';
        exerciseIdInput.value = exercise.id;
        titleInput.value = exercise.title;
        instructionsInput.value = exercise.instructions;
        testFileInput.value = exercise.testFileContent;
        if (exercise.groupId) groupSelect.value = exercise.groupId;
        deleteBtn.classList.remove('hidden');
    } else
    {
        formTitle.textContent = 'New Exercise';
        exerciseIdInput.value = '';
        titleInput.value = '';
        instructionsInput.value = '';
        testFileInput.value = '';
        if (groupSelect.options.length > 0) groupSelect.selectedIndex = 0;
        deleteBtn.classList.add('hidden');
    }
    formMessage.classList.add('hidden');
}

// Save an exercise (create or update)
async function saveExercise()
{
    const id = exerciseIdInput.value;
    const title = titleInput.value;
    const instructions = instructionsInput.value;
    const testFileContent = testFileInput.value;
    const groupId = groupSelect.value;
    if (!title || !instructions || !testFileContent || !groupId)
    {
        showFormMessage('Please fill in all fields', 'error');
        return;
    }
    const isNewExercise = !id;
    const url = isNewExercise ? 'editor.php' : `editor.php/${id}`;
    const method = isNewExercise ? 'POST' : 'PUT';
    try
    {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-API-KEY': API_KEY
            },
            body: JSON.stringify({ title, instructions, testFileContent, groupId })
        });
        const data = await response.json();
        if (data.status === 'success')
        {
            showFormMessage(data.message, 'success');
            fetchExercises(); // Refresh exercise list immediately
        } else
        {
            showFormMessage(data.message || 'Failed to save exercise', 'error');
        }
    } catch (error)
    {
        showFormMessage('An error occurred while saving', 'error');
        console.error(error);
    }
}

// Delete an exercise
async function deleteExercise()
{
    const id = exerciseIdInput.value;

    if (!id)
    {
        return;
    }

    if (!confirm('Are you sure you want to delete this exercise?'))
    {
        return;
    }

    try
    {
        const response = await fetch(`editor.php/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-API-KEY': API_KEY
            }
        });

        const data = await response.json();

        if (data.status === 'success')
        {
            showFormMessage(data.message, 'success');

            // Clear the form
            displayExerciseForm();

            // Refresh exercise list
            fetchExercises();
        } else
        {
            showFormMessage(data.message || 'Failed to delete exercise', 'error');
        }
    } catch (error)
    {
        showFormMessage('An error occurred while deleting', 'error');
        console.error(error);
    }
}

// Show form message
function showFormMessage(message, type)
{
    formMessage.textContent = message;
    formMessage.className = type === 'error' ? 'error' : 'success';
    formMessage.classList.remove('hidden');
}

exerciseList.addEventListener('click', function (e)
{
    if (e.target.tagName === 'LI')
    {
        // Remove 'selected' de todos
        Array.from(exerciseList.children).forEach(li => li.classList.remove('selected'));

        // Adiciona 'selected' ao item clicado
        e.target.classList.add('selected');

        // Aqui você pode carregar os dados do exercício selecionado
        const exerciseId = e.target.dataset.id;
        loadExercise(exerciseId);
    }
});


// Event Listeners
document.addEventListener('DOMContentLoaded', checkAuth);
loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);
saveBtn.addEventListener('click', saveExercise);
cancelBtn.addEventListener('click', () => displayExerciseForm());
deleteBtn.addEventListener('click', deleteExercise);
refreshExercisesBtn.addEventListener('click', fetchExercises);
newExerciseBtn.addEventListener('click', () => displayExerciseForm());