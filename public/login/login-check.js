var loginDetails
        fetch('http://localhost:8080/checkLogin')
        .then((response) => response.json())
        .then((data) => checkLoggedIn(data));
        checkLoggedIn = (logincheck) => {
            if(logincheck.isLoggedIn) {
                getLoginDetails();
            } else console.log("false");
        }
        getLoginDetails = () => {
            fetch('http://localhost:8080/getLoginDetails')
            .then((response) => response.json())
            .then((logindata) => changeLoginBttn(logindata));
            
        }
        changeLoginBttn = (loginData) => {
            const bttn = document.getElementById('loginbttn');
            var accBttn = document.createElement('li');
            accBttn.className = "list-group-item"
            accBttn.className = "nav-item dropdown";
            

            var toggle = document.createElement('a');
            toggle.setAttribute("data-toggle","dropdown");
            toggle.innerText = loginData.username;

            var listDiv = document.createElement('div');
            listDiv.className = "dropdown-menu"
            listDiv.ariaLabel = "acc_drop";

            var accBttnList1 = document.createElement('a');
            accBttnList1.className = "dropsown-item noline";
            accBttnList1.href = "/LogOut";
            accBttnList1.innerText = "Logout";

            var accBttnList2 = document.createElement('a');
            accBttnList2.className = "dropsown-item noline";
            accBttnList2.href = "/login_forms.html";
            accBttnList2.innerText = "Fitness Details";


            var span = document.createElement('span');
            span.className= "caret";

            listDiv.appendChild(accBttnList1);
            listDiv.appendChild(accBttnList2);
            accBttn.appendChild(toggle);
            accBttn.appendChild(span);
            accBttn.appendChild(listDiv);

            
            bttn.replaceWith(accBttn);
        }