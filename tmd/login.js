document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login_form').addEventListener('submit', function(event) {
      event.preventDefault(); 

      const id = document.getElementById('login_id').value;
      const password = document.getElementById('login_password').value;

      user.login(id, password); 

      document.getElementById('login_id').value = '';
      document.getElementById('login_password').value = '';
  });
});

class User {
  constructor() {
      this.loggedIn = false;
      this.username = null;
  }

  login(id, password) {
      fetch('http://localhost/td/check.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({ id, password })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              this.loggedIn = true;
              this.username = id;
          }
          alert(data.message);
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }
}

const user = new User();