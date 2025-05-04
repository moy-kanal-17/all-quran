document.addEventListener("DOMContentLoaded", function () {
  const openSidebarButton = document.getElementById("openSidebar");
  const closeSidebarButton = document.getElementById("closeSidebar");
  const sidebar = document.getElementById("sidebar");
  const surahList = document.getElementById("surahList");

  // Sidebarni ochish
  openSidebarButton.addEventListener("click", function () {
    sidebar.style.transform = "translateX(0)"; // Sidebarni ko'rsatish
  });

  // Sidebarni yopish
  closeSidebarButton.addEventListener("click", function () {
    sidebar.style.transform = "translateX(100%)"; // Sidebarni yashirish
  });

  // Qur'on suralarini olish va sidebarga ro'yxat qilish
  fetch("https://api.alquran.cloud/v1/surah")
    .then((response) => response.json())
    .then((data) => {
      const surahListData = data.data;

      // Har bir sura uchun ro'yxat elementi yaratish
      surahListData.forEach((surah) => {
        const listItem = document.createElement("li");
        listItem.classList.add(
          "p-2",
          "cursor-pointer",
          "hover:bg-blue-100",
          "rounded"
        );
        listItem.textContent = `${surah.number} - ${surah.name}`;

        // Sura nomi bosilganda sura ma'lumotlarini yuklash
        listItem.addEventListener("click", function () {
          loadSurah(surah.number);
          sidebar.style.transform = "translateX(100%)"; // Sidebarni yopish
        });

        surahList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Xatolik yuz berdi:", error);
      alert("Suralarni olishda xato yuz berdi.");
    });

  // Sura ma'lumotlarini yuklash
  function loadSurah(suraNumber) {
    const apiURL = `https://api.alquran.cloud/v1/surah/${suraNumber}/`;

    fetch(apiURL)
      .then((response) => response.json())
      .then((data) => {
        const surahData = data.data;
        const surahName = surahData.name;
        const surahEnglishName = surahData.englishName;
        const surahTransliteration = surahData.transliteration;
        const oyatlar = surahData.ayahs.map((ayat) => ayat.text).join(" ");

        let surahContainer = document.getElementById("surahContainer");
        let surahText = document.getElementById("surahText");
        let surahTitle = document.getElementById("surahName");

        surahTitle.textContent = `${suraNumber} - ${surahName} (${surahEnglishName})`;
        surahText.textContent = `Transliteratsiya: ${surahTransliteration}\n\nOyatlar:\n\n${oyatlar}`;
        surahContainer.classList.remove("hidden");
        surahContainer.classList.add("animate-fadeIn");
      })
      .catch((error) => {
        console.error("Xatolik yuz berdi:", error);
        alert("Sura ma'lumotlarini olishda xato yuz berdi.");
      });
  }
});



document.getElementById("loadSurah").addEventListener("click", function () {
  let searchValue = document.getElementById("searchInput").value.trim();

  if (!searchValue) {
    alert("Iltimos, sura nomini yoki raqamini kiriting!");
    return;
  }

  let suraNumber;
  let suraName;

  // Agar foydalanuvchi raqam kiritgan bo'lsa
  if (!isNaN(searchValue)) {
    suraNumber = parseInt(searchValue);
    if (suraNumber < 1 || suraNumber > 114) {
      alert("Sura raqami 1 dan 114 gacha bo'lishi kerak.");
      return;
    }
    suraName = null; // Raqam bo'lganda ismni olish shart emas
  }
  // Agar foydalanuvchi sura nomini kiritgan bo'lsa
  else {
    suraNumber = null;
    suraName = searchValue.toLowerCase(); // Sura nomini kichik harfda qabul qilamiz
  }

  // Qur'on suralarini olish (nomlar va raqamlar)
  fetch("https://api.alquran.cloud/v1/surah")
    .then((response) => response.json())
    .then((data) => {
      const surahList = data.data;
      const surahSuggestions = document.getElementById("surahSuggestions");
      const suggestionList = document.getElementById("suggestionList");

      suggestionList.innerHTML = "";

      // Foydalanuvchi sura raqamini yoki nomini kiritdi
      const matchedSurahs = surahList.filter((surah) => {
        if (suraNumber && surah.number === suraNumber) {
          return true;
        }
        if (suraName && surah.name.toLowerCase().includes(suraName)) {
          return true;
        }
        return false;
      });

      // Topilgan suralarni ro'yxatda ko'rsatish
      if (matchedSurahs.length > 0) {
        matchedSurahs.forEach((surah) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${surah.number} - ${surah.name}`;
          suggestionList.appendChild(listItem);
        });
        surahSuggestions.classList.remove("hidden");
      } else {
        alert(
          "Hech qanday mos sura topilmadi. Iltimos, yana bir marta tekshirib ko'ring."
        );
        surahSuggestions.classList.add("hidden");
      }

      // Agar foydalanuvchi raqamni yoki nomni to'g'ri kiritgan bo'lsa, ma'lumotlarni yuklash
      const apiURL = `https://api.alquran.cloud/v1/surah/${
        suraNumber || matchedSurahs[0].number
      }/uz.sodik`;

      fetch(apiURL)
        .then((response) => response.json())
        .then((data) => {
          const surahData = data.data;
          const surahName = surahData.name;
          const surahEnglishName = surahData.englishName;
          const surahTransliteration = surahData.transliteration;
          const oyatlar = surahData.ayahs.map((ayat) => ayat.text).join(" ");

          let surahContainer = document.getElementById("surahContainer");
          let surahText = document.getElementById("surahText");
          let surahTitle = document.getElementById("surahName");

          surahTitle.textContent = `${
            suraNumber || matchedSurahs[0].number
          } - ${surahName} (${surahEnglishName})`;
          surahText.textContent = `Transliteratsiya: ${surahTransliteration}\n\nOyatlar:\n\n${oyatlar}`;
          surahContainer.classList.remove("hidden");
          surahContainer.classList.add("animate-fadeIn");
        });
    })
    .catch((error) => {
      console.error("Xatolik yuz berdi:", error);
      alert("Ma'lumotni olishda xato yuz berdi.");
    });
});
