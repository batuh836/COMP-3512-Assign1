

document.addEventListener("DOMContentLoaded", function() {
    const galleryURL = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";
    const galleryPaintingsURL = "https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=";
    const originalPaintingURL = "https://res.cloudinary.com/funwebdev/image/upload/art/paintings/";
    const largePaintingURL = "https://res.cloudinary.com/funwebdev/image/upload/w_500/art/paintings/";
    const squarePaintingURL = "https://res.cloudinary.com/funwebdev/image/upload/w_75/art/paintings/square/";
    
    var galleriesJSON;
    var currentGallery;
    var currentGalleryPaintings;
    var selectedPainting;
    
    document.getElementById("close-button").addEventListener('click', function() {
        document.getElementById("large-painting").src = "";
        document.getElementById("original-painting").src = "";
        document.querySelector(".painting-container").classList.toggle("open");
        document.querySelector(".container").classList.toggle("closed");
    });
    
    document.getElementById("large-painting").addEventListener('click', function() {
        document.querySelector(".painting-container").classList.toggle("open");
        document.querySelector(".original-painting-container").classList.toggle("open");
    });
    
    document.getElementById("original-painting").addEventListener('click', function() {
        document.querySelector(".painting-container").classList.toggle("open");
        document.querySelector(".original-painting-container").classList.toggle("open");
    });
    
    function getGalleries() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            console.log("on ready state changed: " + this.readyState);

            if (this.readyState == 3) {
                console.log("loading");
            }
            else if (this.readyState == 4 && this.status == 200) {
                galleriesJSON = JSON.parse(this.responseText);
                loadGalleries()
                console.log(galleriesJSON);
            }
        };

        xhttp.open("GET", galleryURL, true);
        xhttp.send();
    }
    
    function loadGalleries() {
        //popoulate list
        document.getElementById("gallery-list").innerHTML = "";
        for (let gallery of galleriesJSON) {
            var li = document.createElement("LI");
            li.innerHTML = gallery.GalleryName;
            li.addEventListener('click', function() {
                currentGallery = gallery;
                loadGalleryInfo();
                loadMap()
                getGalleryPaintings();
            });
            document.getElementById("gallery-list").appendChild(li);
        } 
    }
    
    function getGalleryPaintings() {
        let url = galleryPaintingsURL + currentGallery.GalleryID;
        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function() {
            console.log("on ready state changed: " + this.readyState);

            if (this.readyState == 3) {
                console.log("loading");
            }
            else if (this.readyState == 4 && this.status == 200) {
                currentGalleryPaintings = JSON.parse(this.responseText);
                console.log(currentGalleryPaintings);
                loadPaintings();
            }
        };

        xhttp.open("GET", url, true);
        xhttp.send();
    }
    
    function loadGalleryInfo() {
        document.getElementById("gallery-name").innerHTML = currentGallery.GalleryName;
        document.getElementById("gallery-native-name").innerHTML = currentGallery.GalleryNativeName;
        document.getElementById("gallery-city").innerHTML = currentGallery.GalleryCity;
        document.getElementById("gallery-address").innerHTML = currentGallery.GalleryAddress;
        document.getElementById("gallery-country").innerHTML = currentGallery.GalleryCountry;
        document.getElementById("gallery-website").innerHTML = "<a href ='" + currentGallery.GalleryWebSite + "'>" + currentGallery.GalleryWebSite + "</a>"; 
    }
    
    function loadMap() {
        var map;
        map = new google.maps.Map(document.getElementById("map"), { 
            center: { lat: currentGallery.Latitude, lng: currentGallery.Longitude }, 
            zoom: 16 
        });
    }
    
    function loadPaintings() {
        document.getElementById("paintings").innerHTML = "";
        for (let painting of currentGalleryPaintings) {
            var tableRow = document.createElement("TR");
            var paintingColumn = document.createElement("TD");
            var nameColumn = document.createElement("TD");
            var titleColumn = document.createElement("TD");
            var yearColumn = document.createElement("TD");
            var image = document.createElement("IMG");
            
            image.src = squarePaintingURL + painting.ImageFileName;
            image.alt = painting.Title;
            image.addEventListener('click', function() {
                selectedPainting = painting;
                loadPaintingView()
                document.querySelector(".painting-container").classList.toggle("open");
                document.querySelector(".container").classList.toggle("closed");
            });
            
            paintingColumn.appendChild(image);
            nameColumn.innerHTML = painting.LastName;
            titleColumn.innerHTML = painting.Title;
            yearColumn.innerHTML = painting.YearOfWork;
            
            tableRow.appendChild(paintingColumn);
            tableRow.appendChild(nameColumn);
            tableRow.appendChild(titleColumn);
            tableRow.appendChild(yearColumn);
            document.getElementById("paintings").appendChild(tableRow);
        }
    }
    
    function loadPaintingView() {
        document.getElementById("large-painting").src = largePaintingURL + selectedPainting.ImageFileName;
        document.getElementById("original-painting").src = originalPaintingURL + selectedPainting.ImageFileName;
        document.getElementById("painting-title").innerHTML = selectedPainting.Title;
        document.getElementById("painting-artist-name").innerHTML = selectedPainting.FirstName + " " + selectedPainting.LastName;
        document.getElementById("painting-year-of-work").innerHTML = selectedPainting.YearOfWork;
        document.getElementById("painting-medium").innerHTML = selectedPainting.Medium;
        document.getElementById("painting-width").innerHTML = selectedPainting.Width;
        document.getElementById("painting-height").innerHTML = selectedPainting.Height;
        document.getElementById("painting-copyright").innerHTML = selectedPainting.CopyrightText;
        document.getElementById("painting-gallery-name").innerHTML = currentGallery.GalleryName;
        document.getElementById("painting-gallery-city").innerHTML = currentGallery.GalleryCity;
        document.getElementById("painting-museum-link").innerHTML = "<a href ='" + currentGallery.GalleryWebSite + "'>" + currentGallery.GalleryWebSite + "</a>"; 
        document.getElementById("painting-description").innerHTML = selectedPainting.Description;
        setPaintingColors();
    }
    
    function setPaintingColors() {
        let paintingColors = selectedPainting.JsonAnnotations.dominantColors;
        document.getElementById("painting-colors").innerHTML = "";
        
        for (let color of paintingColors) {
            var span = document.createElement("SPAN");
            span.classList.add("painting-color");
            span.title = color.name + ", " + color.web;
            span.style.backgroundColor = color.web;
            document.getElementById("painting-colors").appendChild(span);
        }
    }
    
    getGalleries();
});

