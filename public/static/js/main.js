let db;
let type;

document.addEventListener("DOMContentLoaded", function () {
  try {
    let app = firebase.app();
    let features = [
      "auth",
      "database",
      "firestore",
      "functions",
      "messaging",
      "storage",
      "analytics",
      "remoteConfig",
      "performance",
    ].filter((feature) => typeof app[feature] === "function");

    db = firebase.firestore();

    function domReady(fn) {
      if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
      ) {
        setTimeout(fn, 1000);
      } else {
        document.addEventListener("DOMContentLoaded", fn);
      }
    }

    domReady(function () {
      // If found you qr code
      function onScanSuccess(decodeText, decodeResult) {
        var result = JSON.parse(decodeText);
        result.forEach((data) => {
          const registrationNumber = data.registrationNumber;
          if (registrationNumber) {
            getUserData(registrationNumber);
          }
        });
      }

      let htmlscanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbos: 250,
      });
      htmlscanner.render(onScanSuccess);
    });
  } catch (e) {
    console.error(e);
  }
});

function getUserData(id) {
  try {
    var registrationsRef = db.collection("registrations").doc(id);

    registrationsRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const mainAttendanceBtn = document.getElementById("fbs-attendance-btn-main");
          const heroSectionTitle = document.getElementById("fbs-title");
          const heroSectionDescription =
            document.getElementById("fbs-description");

          heroSectionTitle.innerHTML = `<span class="text-line"> Hello,</span>
                    <span class="wow fadeInLeft" data-wow-delay=".4s">${
                      data.name.split(" ")[0]
                    }</span>`;
          heroSectionDescription.style.display = "block";

          heroSectionDescription.innerHTML = 
          `<span class="text-line-small">
                Thank you for attending TEDx AJCE 2024 🎉
            </span><br />
            <span class="text-line-small">
                Your registration number is
            <span>${data.id}</span></span>`;
          
            heroSectionDescription.style.display = "block";
            mainAttendanceBtn.style.display = "none";
        } else {
          console.log("No such document!");
          alert("Could not find the user with the given registration number");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } catch (e) {
    console.error(e);
  }
}
