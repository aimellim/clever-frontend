function loadItem() {
  $('.loadItem').each(function() {
    $(this).animate({ 'opacity': '1' }, 300);
  });
}

function shopSliders() {
  $('.js-main-slider').owlCarousel({
    animateOut: 'fadeOut',
    items: 1,
    navigation: true,
    loop: false,
    navigationText: ["", ""]
  });

  $('.js-product-carousel').owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    navText: ["", ""],
    responsive: {
      979: {
        items: 3,
      },
      479: {
        items: 2,
      },
      0: {
        items: 1,
      }
    }
  });

  $('.js-blog-carousel').owlCarousel({
    nav: true,
    dots: false,
    loop: true,
    navText: ["", ""],
    responsive: {
      1199: {
        items: 2,
      },
      0: {
        items: 1,
      }
    }
  });
}

function otherScripts() {
  $('.random-items .point .point-image').each(function() {
    $(this).prev().addClass('has-bg');
  });
}

function searchInput() {
  $('.search-input').keyup(function() {
    var thisEl = $(this);
    var val = thisEl.val();

    if (val === '') {
      thisEl.removeAttr('style');
    } else {
      thisEl.css({
        'max-width': '200px',
        'padding': '10px'
      });
    }

  });
}

function productMiniatures() {
  $('.product-preview .product-miniatures img').on('click', function() {
    var thisEl = $(this);
    var container = thisEl.parents('.product-preview:first');
    var bigContainer = container.find('.product-image');
    var bigImg = bigContainer.find('img');

    var dataSrc = thisEl.attr('data-src');
    bigImg.attr('src', dataSrc);
  });
}

function scrollMenuMobile() {
  $('.main-menu.mobile .open-menu').each(function() {
    var thisEl = $(this);
    var thisElBg = $('.open-menu-bg');
    var logoElem = $('.logo-fixed');
    var w = $(window).scrollTop();
    var t = thisEl.parent().offset().top;

    if (w >= t) {
      thisEl.addClass('fixed');
      thisElBg.addClass('fixed');
      logoElem.addClass('fixed');
    } else
    if (w < t) {
      thisEl.removeClass('fixed');
      thisElBg.removeClass('fixed');
      logoElem.removeClass('fixed');
    }
  });
}

function menuMobile() {
  $('.js-open-menu').on('click', function() {
    $('.dropdown-menu-mobile').animate({ 'left': '0' }, 300);
    $('.mobile-bg').fadeIn(300);
  });
  $('.mobile-bg').on('click', function() {
    $('.dropdown-menu-mobile').animate({ 'left': '-250px' }, 300);
    $('.mobile-bg').fadeOut(300);
  });

  $('.dropdown-menu-mobile .main-menu ul i').on('click', function() {
    if ($(this).hasClass('fa-angle-down')) {
      $(this).removeClass('fa-angle-down').addClass('fa-angle-up');
      $(this).next().css('display', 'block');
    } else {
      $(this).removeClass('fa-angle-up').addClass('fa-angle-down');
      $(this).next().css('display', 'none');
    }
  });

  $('.dropdown-menu-mobile a').on('click', function() {
    $('.dropdown-menu-mobile a').css({
      'background': 'transparent'
    });

    $(this).css({
      'background': '#F4D01F'
    })
  });
}

function sidebarMenu() {
  $('.collection-menu .menu_icon').on('click', function() {
    if ($(this).hasClass('right')) {
      $(this).removeClass('right').addClass('left').next().slideDown('300');
    } else {
      $(this).removeClass('left').addClass('right').next().slideUp('300');
    }
  });
  
  if ($('.collection-menu i + .submenu').hasClass('active')) $('.collection-menu i + .submenu').slideDown('300');

  $('.collection-filters .filter-header').on('click', function() {
    if ($(this).hasClass('price-filter')) {

    } else {
      if ($(this).find('.menu_icon').hasClass('right')) {
        $(this).find('.menu_icon.right').removeClass('right').addClass('left')
        $(this).next().slideDown('300');
      } else {
        $(this).find('.menu_icon.left').removeClass('left').addClass('right')
        $(this).next().slideUp('300');
      }
    }
  });
}

function totalCount() {
  var inputQuantity = $('.js-quantity-number');

  if (inputQuantity.parents('.cart-page:first').hasClass('js-cart-page')) {
    var total = 0;
    inputQuantity.each(function() {
      var thisVal = $(this).val() * 1;
      total = total + thisVal;
      $('.js-items-count').html(total);
    });

    var totalItems = $('.js-items-count').html();
    var wordCount = $('.js-word-count');

    var lastSymbol = totalItems.substr(-1);

    if (lastSymbol == 1) {
      if (totalItems == 11 || totalItems == 111 || totalItems == 211 || totalItems == 311 || totalItems == 411 || totalItems == 511) {
        wordCount.html('&nbsp;товаров');
      } else {
        wordCount.html('&nbsp;товар');
      }

    } else
    if (lastSymbol == 2) {
      if (totalItems == 12 || totalItems == 112 || totalItems == 212 || totalItems == 312 || totalItems == 412 || totalItems == 512) {
        wordCount.html('&nbsp;товаров');
      } else {
        wordCount.html('&nbsp;товара');
      }

    } else
    if (lastSymbol == 3) {
      if (totalItems == 13 || totalItems == 113 || totalItems == 213 || totalItems == 313 || totalItems == 413 || totalItems == 513) {
        wordCount.html('&nbsp;товаров');
      } else {
        wordCount.html('&nbsp;товара');
      }

    } else
    if (lastSymbol == 4) {
      if (totalItems == 14 || totalItems == 114 || totalItems == 214 || totalItems == 314 || totalItems == 414 || totalItems == 514) {
        wordCount.html('&nbsp;товаров');
      } else {
        wordCount.html('&nbsp;товара');
      }

    } else
    if (lastSymbol >= 5 && lastSymbol <= 9) {
      wordCount.html('&nbsp;товаров');
    } else
    if (lastSymbol == 0) {
      wordCount.html('&nbsp;товаров');
    }
  }

}

function cartTitles() {
  $('.js-size-1').each(function() {
    if ($(window).width() <= 1024) {
      $('.js-size-2').css('height', 'auto');
    } else {
      var a = $('.js-size-1').innerHeight();
      $('.js-size-2').css('height', a + 'px');
    }
  });
}

function cartRelated() {
  $('.cart-related').each(function() {
    var thisEl = $(this);
    var buffer = $('.js-related-products');

    thisEl.appendTo(buffer);
  });

  $('.js-related-products').each(function() {
    var thisEl = $(this);
    var parent = thisEl.parent();

    if (thisEl.html() == '') {
      parent.css('display', 'none');
      parent.prev().removeClass('flex-xl-9').addClass('flex-xl-12');
    }
  });

}

function adaptiveFooter() {
  var h = $('footer').innerHeight();
  $('.page-content').css('padding-bottom', h + 'px');
}

$(document).ready(function() {
  shopSliders();
  searchInput();
  otherScripts();
  productMiniatures();
  menuMobile();
  sidebarMenu();
  totalCount();
  cartRelated();
  // adaptiveFooter();
});

$(window).load(function() {
  loadItem();
  scrollMenuMobile();
  cartTitles();
  // adaptiveFooter();
});

$(window).resize(function() {
  scrollMenuMobile();
  cartTitles();
  // adaptiveFooter();
});

$(window).scroll(function() {
  scrollMenuMobile();
});
