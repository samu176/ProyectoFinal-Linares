class libro {
  constructor(titulo,autor,genero,imagen) {
    this.titulo=titulo;
    this.autor=autor;
    this.genero=genero;
    this.imagen=imagen;
  }
}

let wishlist=JSON.parse(localStorage.getItem("wishlist"))||[];

async function buscarImagenLibro(titulo) {
  const apiUrl= `https://openlibrary.org/search.json?q=${encodeURIComponent(titulo)}`;

  try {
    const response=await fetch(apiUrl);
    const data=await response.json();
    if (data.docs && data.docs.length > 0) {
      const libro=data.docs[0];
      const coverId=libro.cover_i;
      const imagenUrl=`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
      return imagenUrl;
    } else {
      return "";
    }
  } catch (error){console.error("Error al buscar la imagen del libro:", error);
    return "";
  }
}

function mostrarWishlist() {
  const wishlistElement=$("#wishlist");
  wishlistElement.empty();

  wishlist.forEach((libro, index) => {
    const card=$("<div>").addClass("card mb-3");
    const cardBody = $("<div>").addClass("card-body");
    const cardTitle = $("<h5>").addClass("card-title").text(libro.titulo);
    const cardText = $("<p>").addClass("card-text").text(`Autor: ${libro.autor}\nGénero: ${libro.genero}`);
    if (libro.imagen) {
      const cardImage = $("<img>").addClass("card-img-top").attr("src", libro.imagen);
      card.append(cardImage);
    }

    cardBody.append(cardTitle);
    cardBody.append(cardText);
    card.append(cardBody);
    wishlistElement.append(card);
  });
}

async function agregarLibro() {
  const tituloLibro = $("#titulo").val();
  const autorLibro = $("#autor").val();
  const generoLibro = $("#genero").val();

  const imagenUrl = await buscarImagenLibro(tituloLibro);
  wishlist.push(new libro(tituloLibro, autorLibro, generoLibro, imagenUrl));
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  mostrarWishlist();

  Swal.fire({
    title: "FELICIDADES",
    text: "El libro se agregó a tu wishlist",
    icon: "success",
    confirmButtonText: "Aceptar"
  });
}

$("#agregarlibro").click(agregarLibro);

$(document).ready(function() {
mostrarWishlist();
});
