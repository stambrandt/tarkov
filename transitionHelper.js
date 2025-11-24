document.addEventListener("DOMContentLoaded", function() {
    const connectionHelper = document.getElementById('connectionHelper');
    const handle = document.getElementById('connectionHandle');
    let isVisible = true;

    handle.addEventListener('mousedown', function() {
        if (isVisible) {
            connectionHelper.style.right = '-270px';
        } else {
            connectionHelper.style.right = '10px';
        }
        isVisible = !isVisible;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const mapControls = document.getElementById('mapControls');
    const handle = document.getElementById('mapHandle');
    let isVisible = true;

    handle.addEventListener('mousedown', function() {
        if (isVisible) {
            mapControls.style.left = '-270px';
        } else {
            mapControls.style.left = '10px';
        }
        isVisible = !isVisible;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const randomControls = document.getElementById('randomControls');
    const handle = document.getElementById('randomHandle');
    let isVisible = true;

    handle.addEventListener('mousedown', function() {
        if (isVisible) {
            randomControls.style.left = '-270px';
        } else {
            randomControls.style.left = '10px';
        }
        isVisible = !isVisible;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const itemControls = document.getElementById('itemControls');
    const handle = document.getElementById('itemHandle');
    let isVisible = true;

    handle.addEventListener('mousedown', function() {
        if (isVisible) {
            itemControls.style.left = '-270px';
        } else {
            itemControls.style.left = '10px';
        }
        isVisible = !isVisible;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const searchControls = document.getElementById('searchControls');
    const handle = document.getElementById('searchHandle');
    let isVisible = true;

    handle.addEventListener('mousedown', function() {
        if (isVisible) {
            searchControls.style.left = '-400px';
        } else {
            searchControls.style.left = '10px';
        }
        isVisible = !isVisible;
    });
});