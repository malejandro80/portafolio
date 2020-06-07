/** @format */

(function ($) {
  'use strict';
  var nav = $('nav');
  var navHeight = nav.outerHeight();
  let english = lang.english;
  let spanish = lang.spanish;

  $('#lang').on('change', function () {
    if ($('#lang')[0].checked) {
      setLanguaje('spanish');
    } else {
      setLanguaje('english');
    }
  });

  $('.navbar-toggler').on('click', function () {
    if (!$('#mainNav').hasClass('navbar-reduce')) {
      $('#mainNav').addClass('navbar-reduce');
    }
  });

  // Preloader
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader')
        .delay(100)
        .fadeOut('slow', function () {
          $(this).remove();
        });
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });

  /*--/ Star ScrollTop /--*/
  $('.scrolltop-mf').on('click', function () {
    $('html, body').animate(
      {
        scrollTop: 0,
      },
      1000
    );
  });

  /*--/ Star Counter /--*/
  $('.counter').counterUp({
    delay: 15,
    time: 2000,
  });

  /*--/ Star Scrolling nav /--*/
  $('a.js-scroll[href*="#"]:not([href="#"])').on('click', function () {
    if (
      location.pathname.replace(/^\//, '') ==
        this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate(
          {
            scrollTop: target.offset().top - navHeight + 5,
          },
          1000,
          'easeInOutExpo'
        );
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll').on('click', function () {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: navHeight,
  });
  /*--/ End Scrolling nav /--*/

  /*--/ Navbar Menu Reduce /--*/
  $(window).trigger('scroll');
  $(window).on('scroll', function () {
    var pixels = 50;
    var top = 1200;
    if ($(window).scrollTop() > pixels) {
      $('.navbar-expand-md').addClass('navbar-reduce');
      $('.navbar-expand-md').removeClass('navbar-trans');
    } else {
      $('.navbar-expand-md').addClass('navbar-trans');
      $('.navbar-expand-md').removeClass('navbar-reduce');
    }
    if ($(window).scrollTop() > top) {
      $('.scrolltop-mf').fadeIn(1000, 'easeInOutExpo');
    } else {
      $('.scrolltop-mf').fadeOut(1000, 'easeInOutExpo');
    }
  });

  /*--/ Star Typed /--*/
  if ($('.text-slider').length == 1) {
    var typed_strings = $('.text-slider-items').text();
    var typed = new Typed('.text-slider', {
      strings: typed_strings.split(','),
      typeSpeed: 80,
      loop: true,
      backDelay: 1100,
      backSpeed: 30,
    });
  }

  /*--/ Testimonials owl /--*/
  $('#testimonial-mf').owlCarousel({
    margin: 20,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
    },
  });

  function setLanguaje(lang) {
    let languaje = {};
    if (lang === 'english') {
      languaje = english;
    } else if (lang === 'spanish') {
      languaje = spanish;
    }

    $('.navbar-brand.js-scroll').text(languaje.tittle);
    $('#inicio').text(languaje.home);
    $('#sobre_mi').text(languaje.about);
    $('#servicios').text(languaje.services);
    $('#portafolio').text(languaje.portfolio);
    $('#contacto').text(languaje.contact);
    $('#sobre_mi_2').text(languaje.about);

    $('#descripcion').text(languaje.about_message);
    $('#Habilidad').text(languaje.skills);
    $('#etiqueta1').text(languaje.name);
    $('#etiqueta2').text(languaje.profile);
    $('#etiqueta3').text(languaje.email);
    $('#etiqueta4').text(languaje.phone);
    $('#servicios2').text(languaje.services);
    $('#s-1').text(languaje.frontend_develop);
    $('#s-2').text(languaje.backend_develop);
    $('#s-3').text(languaje.responsive);
    $('#ss-1').text(languaje.frontend_develop_msj);
    $('#ss-2').text(languaje.backend_develop_msj);
    $('#ss-3').text(languaje.responsive_msj);
    $('#portafolio2').text(languaje.portfolio);
    $('#encuentrame').text(languaje.find_me);
    $('#encuentrame_msj').text(languaje.find_me_msj);
  }
})(jQuery);
