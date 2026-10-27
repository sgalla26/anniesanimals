/* Datepicker - jQuery-UI
   jQuery Validate - jQuery Plugin 1
   Lightbox2 - jQuery Plugin 2 */

$(document).ready(function () {

    emailjs.init("xUdADIppnX75x03FO");

    // jQuery Datepicker - Calendar Page

    $("#appointmentDate").datepicker({
        minDate: 0,
        dateFormat: "mm/dd/yy"
    });

    // Validate the form using jQuery
    $("#apptForm").validate({
        errorPlacement: function(error, element) {
            error.insertAfter(element); 
        },
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            petType: "required",
            appointmentDate: "required"
        },
        submitHandler: function(form, event) {
            event.preventDefault();

            // Collect form data
            const templateParams = {
                name: $("#name").val(),
                email: $("#email").val(),
                petType: $("#petType").val(),
                date: $("#appointmentDate").val()
            };

            // Send using EmailJS AJAX
            emailjs.send("service_sdc1icc", "template_do1ny7q", templateParams)
                .then(() => {
                    alert("Appointment request emailed successfully!");
                    form.reset();
                })
                .catch((error) => {
                    console.error("EMAILJS ERROR:", error);
                    alert("There was a problem sending your email.");
                });
        }
    });

    // jQuery validation for contact page
    
    if ($("#contactForm").length) {
        $("#contactForm").validate({
            errorPlacement: function(error, element) {
                error.insertAfter(element); 
            },
            rules: {
                name: { required: true },
                email: { required: true, email: true },
                message: { required: true }
            },
            messages: {
                name: "Please enter your name",
                email: "Please enter a valid email",
                message: "Please write a message"
            },
            submitHandler: function (form, event) {
                event.preventDefault();

                const templateParams = {
                    name: $("#contactName").val(),
                    email: $("#contactEmail").val(),
                    message: $("#contactMessage").val()
                };

                // Sends email using AJAX
                emailjs.send("service_sdc1icc", "template_gvpnupw", templateParams)
                    .then(() => {
                        alert("Your message was emailed successfully!");
                        form.reset();
                    })
                    .catch((error) => {
                        console.error("EMAILJS ERROR:", error);
                        alert("There was an issue sending your message.");
                    });
            }
        });
    }

    // Using localstorage to save entries
    
    function loadReviews() {
        const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];

        $("#reviewsContainer").empty();

        storedReviews.forEach(review => {
            let stars = "";
            for (let i = 0; i < review.rating; i++) {
                stars += "<img src='images/star.png' class='star'>";
            }

            $("#reviewsContainer").prepend(`
                <div class="review-box">
                    <strong>${review.name}</strong><br>
                    ${stars}
                    <p>${review.text}</p>
                </div>
            `);
        });
    }

        if ($("#reviewsContainer").length) {
            loadReviews();
        }

        // Validate review form using jQuery
        if ($("#reviewForm").length) {
            $("#reviewForm").validate({
                rules: {
                    reviewer: { required: true },
                    reviewText: { required: true, minlength: 10 },
                    rating: { required: true }
                },
                messages: {
                    reviewer: "Enter your name",
                    reviewText: "Write at least 10 characters",
                    rating: "Select a rating"
                },

                submitHandler: function (form) {

                    const name = $("input[name='reviewer']").val();
                    const text = $("textarea[name='reviewText']").val();
                    const rating = $("select[name='rating']").val();

                    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

                    reviews.push({
                        name: name,
                        text: text,
                        rating: rating
                    });

                    localStorage.setItem("reviews", JSON.stringify(reviews));

                    loadReviews();

                    form.reset();
                }
            });
        }
    
    // Gallery Upload also using localstorage

    function loadGallery() {
        const images = JSON.parse(localStorage.getItem("galleryImages")) || [];

        $("#galleryGrid").empty();

        // Populate gallery with stored images
        images.forEach(src => {
            $("#galleryGrid").append(`
                <a href="${src}" data-lightbox="pets">
                    <img src="${src}">
                </a>
            `);
        });
    }

        // Load saved images on page load
        if ($("#galleryGrid").length) {
            loadGallery();
        }

        // Validation for form
        $("#uploadForm").on("submit", function (e) {
            e.preventDefault();

            const file = $("#imageUpload")[0].files[0];

            if (!file) {
                alert("Please select an image first!");
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {
                const imageData = event.target.result;

                let images = JSON.parse(localStorage.getItem("galleryImages")) || [];

                images.push(imageData);

                localStorage.setItem("galleryImages", JSON.stringify(images));

                loadGallery();
            };

            reader.readAsDataURL(file);
        });

});