import css from "./ImgFilter.module.css";
import { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";

const apiKey = import.meta.env.VITE_API_KEY;

import axios from "axios";

export default function ImgFilter() {
  const [searchQuery, setSearchQuery] = useState(() => {
    const savedQuery = localStorage.getItem("searchQuery");
    return savedQuery ? savedQuery : "";
  });
  const [query, setQuery] = useState(searchQuery);
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (query === "") {
      return;
    }

    const fetchImages = async () => {
      try {
        const respons = await axios.get("https://pixabay.com/api/", {
          params: {
            q: query,
            key: apiKey,
            page,
            per_page: 12,
          },
        });

        if (page === 1) {
          setImages(respons.data.hits);
        } else {
          setImages((prevImages) => [...prevImages, ...respons.data.hits]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, [query, page]);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  function handleChange(e) {
    setSearchQuery(e.target.value);
  }

  function handleSubmit() {
    setQuery(searchQuery);
    setPage(1);
  }

  function handleModal(event) {
    if (event.target.tagName !== "IMG") {
      return;
    }

    setLoaded(false);

    setModalImage({
      src: event.target.src,
      alt: event.target.alt,
    });
  }

  function handleLoad() {
    if (isLoaded === false) {
      setLoaded(true);
    } else if (isLoaded === true) {
      return;
    }
  }

  function closeModal() {
    setModalImage(null);
    setLoaded(false);
  }

  return (
    <section onKeyDown={handleKeyDown} className={css.section}>
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
        <div className={css.content} onClick={handleModal}>
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

        {images.length > 0 && (
          <div className={css.loader}>
            <button
              className={css.loadMoreBtn}
              onClick={() => setPage((prevPage) => prevPage + 1)}
            >
              Load more
            </button>
          </div>
        )}
      </div>

      {modalImage && (
        <div className={css.modal} onClick={closeModal}>
          <div
            className={css.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage.src}
              alt={modalImage.alt}
              className={`${css.handleImg} ${isLoaded ? css.loaded : ""} `}
              onLoad={handleLoad}
            />
          </div>
        </div>
      )}
    </section>
  );
}
