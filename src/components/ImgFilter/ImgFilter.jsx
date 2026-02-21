import css from "./ImgFilter.module.css";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

// apiKey не обов'язково імпортувати з .env, але зазвичай  api ключі  записуються в .env, щоб ніхто не міг їх побачити
const apiKey = import.meta.env.VITE_API_KEY;

import axios from "axios";

export default function ImgFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);

  const getImages = async () => {
    try {
      const respons = await axios.get("https://pixabay.com/api/", {
        params: {
          q: searchQuery,
          // q це шота тіпа параметр pixabay, тоїсть те, що йде після / в кінці http запиту, а searchQuery це значення q (тоїсть змінна)
          key: apiKey,
        },
      });
      setImages(respons.data.hits);

      // data.hits це шлях до картинок, якщо ти пропишеш просто respons в консоль, то там буде великий json файл з іншими об'єктами і масивами всередині
    } catch (error) {
      console.log(error);
    }
  };

  function handleChange(e) {
    setSearchQuery(e.target.value);
  }

  function handleSubmit() {
    getImages();
  }

  return (
    <section>
      <div className={css.searchBar}>
        <button className={css.searchButton} onClick={handleSubmit}>
          <IoSearchOutline />
        </button>
        <input
          type="text"
          className={css.searchInput}
          placeholder="Search images and photos"
          onChange={handleChange}
          value={searchQuery}
        />
      </div>
      <div className={css.container}>
        <div className={css.content}>
          {images.map((image) => {
            return (
              <img
                key={image.id}
                src={image.webformatURL}
                alt={image.tags}
                className={css.image}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
