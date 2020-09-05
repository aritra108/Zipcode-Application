/* DOM elements */
const invalidMessage = document.querySelector('#invalid-message');
const inputField = document.querySelector('#form-input');
const formIcons = document.querySelector('#form-icons');
const submitBtn = document.querySelector('#submit-btn');
const locationDetailsList = document.querySelector('#location-details-list');

// DOM elements to be added by Javascript 
const searchIcon = `
            <i id = 'search-icon' class="fa fa-search" aria-hidden="true"></i>
            `;
const closeIcon  = `
            <i id = 'close-icon' class="fa fa-times" aria-hidden="true"></i>
            `;


// Class UI: Handles the UI 
class UI {

    // Provides typing animation
    static formTypingAnimation (e) {

        if ( inputField.value === '' ) { // If the input field is empty, replace with the search icon 
            formIcons.innerHTML = searchIcon;
        }

        else { // If the input field is not empty , and replace with the close icon 
            formIcons.innerHTML = closeIcon;
        }

    }

    // Clears the input field 
    static clearForm (id) {

        // Clear the input field 
        inputField.value = '';

        // Reset the icon back to search
        formIcons.innerHTML = searchIcon;

    }

    // Shows API details in UI 
    static addDetails (area, division, district, region, state) {

        // Convert the details to html 
        const areaHtml = `
            <li class = 'list-item' id = 'area'>
               <div class = 'list-item-content attribute'>
                    Area
               </div>
               <div class = 'list-item-division'></div>
               <div class = 'list-item-content value'>
                    ${area}
               </div>
            </li>
        `;

        const divisionHtml = `
            <li class = 'list-item' id = 'division'>
               <div class = 'list-item-content attribute'>
                    Division
               </div>
               <div class = 'list-item-division'></div>
               <div class = 'list-item-content value'>
                    ${division}
               </div>
            </li>
        `;

        const districtHtml = `
            <li class = 'list-item' id = 'district'>
               <div class = 'list-item-content attribute'>
                    District
               </div>
               <div class = 'list-item-division'></div>
               <div class = 'list-item-content value'>
                    ${district}
               </div>
            </li>
        `;

        const regionHtml = `
            <li class = 'list-item' id = 'region'>
               <div class = 'list-item-content attribute'>
                    Region
               </div>
               <div class = 'list-item-division'></div>
               <div class = 'list-item-content value'>
                    ${region}
               </div>
            </li>
        `;

        const stateHtml = `
            <li class = 'list-item' id = 'state'>
               <div class = 'list-item-content attribute'>
                    State
               </div>
               <div class = 'list-item-division'></div>
               <div class = 'list-item-content value'>
                    ${state}
               </div>
            </li>
        `;

        // Add the above HTML to the DOM
        locationDetailsList.innerHTML = areaHtml + divisionHtml + districtHtml + regionHtml + stateHtml;
    }

    // Show error message if invalid pincode is entered 
    static showErrorMessage () {
        invalidMessage.style.marginTop = '5vh';
        invalidMessage.style.opacity = 1;

        setTimeout(() => { // keep the error message for 1.5s
            invalidMessage.style.marginTop = '-5vh';
            invalidMessage.style.opacity = 0;
        }, 1500);
    }

}

// Class API: Handles the API functions 
class API {
    
    static get (pincode) {

        fetch('https://api.postalpincode.in/pincode/' + pincode)
            .then (res => res.text())
            .then(data => {
                // Convert the data to JSON 
                data = JSON.parse(data);
                
                // Check for success message 
                const msg = data[0].Status;
                if (msg !== 'Success') {
                    
                    // Create a custom error message 
                    const errMessage = `
                        <h1 id = 'error-heading' class = 'heading'>No Details Found!</h1>
                    `
                    // Add the error message to the HTML 
                    locationDetailsList.innerHTML = errMessage;
                    return;
                }

                // Extract the details from the JSON 
                const area = data[0].PostOffice[0].Name;
                const division = data[0].PostOffice[0].Division;
                const district = data[0].PostOffice[0].District;
                const region = data[0].PostOffice[0].Region;
                const state = data[0].PostOffice[0].State;

                // Add the details to the UI
                UI.addDetails(area, division, district, region, state);
            })
            .catch(err => console.log(err));

    }

}

// Event: Listen for typing in input field 
inputField.addEventListener('keyup', e => UI.formTypingAnimation(e));

// Event: Listen for click over the close icon
formIcons.addEventListener('click', e => {

    if (e.target.id === 'close-icon')
        UI.clearForm(); // Clear the input field 

});

// Event: The submit button is clicked 
submitBtn.addEventListener('click', submitPincode);

// Event: The enter key is pressed in the input field 
inputField.addEventListener('keyup', e => {
    if ( e.keyCode === 13 )
        submitPincode();
});

// Function: Handles the submit operations 
function submitPincode () {

    // Extract the input value 
    const pincode = inputField.value;

    // Validate the input
    const len = pincode.toString().length;
    if (len !== 6 || pincode === '') {
        console.log('Invalid Pincode');
        UI.showErrorMessage();
        return;
    }

    // Pass the pincode to API call 
    API.get(pincode);

    // Reset the input field 
    UI.clearForm();
}

/**
 * Operations remaining:
 * 
 * 
 * 3. Responsiveness 
 */