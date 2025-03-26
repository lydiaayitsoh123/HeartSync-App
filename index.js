document.addEventListener("DOMContentLoaded", () => {
    fetchMembers();

    document.getElementById("registration-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const newUser = {
            name: document.getElementById("name").value,
            age: document.getElementById("age").value,
            bio: document.getElementById("bio").value,
            image: document.getElementById("image").value
        };

        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then(data => {
            alert("Welcome to Heartsyc!");
            displayNewUser(data);
        })
        .catch(error => console.error("Error:", error));

        e.target.reset();
    });
});

function fetchMembers() {
    fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(data => {
            data.forEach(user => displayNewUser(user));
        })
        .catch(error => console.error("Error fetching members:", error));
}

function displayNewUser(user) {
    const membersList = document.getElementById("members-list");

    const memberCard = document.createElement("div");
    memberCard.classList.add("member-card");
    memberCard.setAttribute("data-id", user.id); 

    memberCard.innerHTML = `
        <img src="${user.image}" class="profile-pic" alt="${user.name}">
        <h4>${user.name}, ${user.age}</h4>
        <p>${user.bio}</p>
        <button onclick='displayProfile(${JSON.stringify(user)})'>View Profile</button>
        <button class="delete-btn">🗑️ Delete</button>
    `;

    
    memberCard.querySelector(".delete-btn").addEventListener("click", () => deleteUser(user.id, memberCard));

    membersList.appendChild(memberCard);
}

function displayProfile(user) {
    const profileSection = document.getElementById("profile-section");
    const profileDetails = document.getElementById("profile-details");

    if (!profileSection || !profileDetails) {
        console.error("Error: profile-section element not found.");
        return;
    }

    profileDetails.innerHTML = `
        <img src="${user.image}" class="profile-pic" alt="${user.name}">
        <h3>${user.name}, ${user.age}</h3>
        <p>${user.bio}</p>
        <button onclick="acceptUser('${user.name}')">❤️ Select</button>
        <button onclick="rejectUser('${user.name}')">❌ Reject</button>
        <button onclick="closeProfile()">Close</button>
    `;

    profileSection.style.display = "block";
}

function acceptUser(name) {
    alert(`You selected ${name}! 💖`);
}

function rejectUser(name) {
    alert(`You rejected ${name}. 😔`);
}

function closeProfile() {
    const profileSection = document.getElementById("profile-section");
    profileSection.style.display = "none";
}

function deleteUser(userId, memberCard) {
    fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            alert("User deleted successfully.");
            memberCard.remove(); 
        } else {
            alert("Failed to delete user.");
        }
    })
    .catch(error => console.error("Error deleting user:", error));
}
