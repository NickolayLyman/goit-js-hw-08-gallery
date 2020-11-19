import galleryItems from './gallery-items.js';

const galleryContainerRef = document.querySelector('.js-gallery');
const modalWrapperRef = document.querySelector('.js-lightbox');
const modalImgRef = document.querySelector('.lightbox__image');
const modalCloseBtnRef = document.querySelector(
  '[data-action="close-lightbox"]',
);
const modalOverlayRef = document.querySelector('.lightbox__overlay');

const galleryMarkup = creategalleryMarkup(galleryItems);
galleryContainerRef.insertAdjacentHTML('beforeend', galleryMarkup);

function creategalleryMarkup(items) {
  return items
    .map(({ preview, original, description }, index) => {
      return `
        <li class="gallery__item">
        <a class="gallery__link"
        href="${original}"
        >
        <img
            data-index="${index}"
            class="gallery__image"
            src="${preview}"
            data-source="${original}"
            alt="${description}"
        />
    </a>
</li>
`;
    })
    .join('');
}

galleryContainerRef.addEventListener('click', onGalleryItemOpen);

function onGalleryItemOpen(event) {
    event.preventDefault();
  if (event.target.tagName !== 'IMG') {
    return;
  }
  onOpenModal(event);
}

function onOpenModal(event) {
  window.addEventListener('keydown', onEscCloseModal);
  galleryContainerRef.addEventListener('keydown', onClickImageSlide);

  modalWrapperRef.classList.add('is-open');
  setImageAttribute(event);
}

function setImageAttribute(event) {
  modalImgRef.src = event.target.dataset.source;
  modalImgRef.alt = event.target.alt;
  modalImgRef.setAttribute('data-index', event.target.dataset.index);
}

modalWrapperRef.addEventListener('click', onOverlayClick);

function onCloseModal() {
  window.removeEventListener('keydown', onEscCloseModal);
  galleryContainerRef.removeEventListener('keydown', onClickImageSlide);
  modalWrapperRef.classList.remove('is-open');
  unsetImageAttributes();
}

function unsetImageAttributes() {
  modalImgRef.src = '';
  modalImgRef.alt = '';
}

function onOverlayClick(event) {
  if (event.target === modalOverlayRef || event.target === modalCloseBtnRef) {
    onCloseModal();
  }
}

function onEscCloseModal(event) {
  if (event.code === 'Escape') {
    onCloseModal();
  }
}

function onClickImageSlide(event) {
  const {
    dataset: { index },
  } = modalImgRef;
  const parsedIndex = parseInt(index);
  const firstChild = 0;
  const lastChild = galleryItems.length - 1;

  if (event.code === 'ArrowRight') {
    const newIndex = parsedIndex === lastChild ? firstChild : parsedIndex + 1;
    setNewAttributes(newIndex);
  }

  if (event.code === 'ArrowLeft') {
    const newIndex = parsedIndex === firstChild ? lastChild : parsedIndex - 1;
    setNewAttributes(newIndex);
  }
}

function setNewAttributes(newIndex) {
  const { original, description } = galleryItems[newIndex];
  modalImgRef.src = original;
  modalImgRef.alt = description;
  modalImgRef.dataset.index = newIndex;
}
