$(function () {


  /**
   * COMPARE
   * Работа со списками сравнения
   * Кнопки сравнения обновляются через JS (переключаются классы ACTIVE)
   * Переключение отображения повторяющихся свойств
   * После UPDATE весь блок обновляется через $.LOAD - так как классы повторяющихся трок расставляются только со стороны
   * сервера
   */
  var $compareCount = $('.js-compare-amount');
  var $compareTable = $('.js-compare-table');
  
  var compareWrapper = '#js-compare-wrapper';
  var compareInner = '#js-compare-inner';
  var compareUrl = document.location.href;
  
  EventBus.subscribe('before:insales:compares', function () {
    if (Site.template == 'compare') {
      $('<div class="preloader is-white is-32"></div>').prependTo($(compareWrapper)).fadeIn('fast');
    }
  });
  
  EventBus.subscribe('init:insales:compares', function (data) {
    for (i = 0; i < data.products.length; i++) {
      var $id = data.products[i].id;
      
      $('[data-compare-add="' + $id + '"]').addClass('active').attr('data-compare-delete', $id).removeAttr('data-compare-add');
    }
    $compareCount.html(data.products.length);
  });
  
  EventBus.subscribe('add_item:insales:compares', function (data) {
    var $linck = $(data.action.button[0]);
    
    $linck.addClass('active').attr('data-compare-delete', $linck.data('compare-add')).removeAttr('data-compare-add');
    alertify.success('Товар добавлен в сравнение');
  });
  
  EventBus.subscribe('remove_item:insales:compares', function (data) {
    var $id = data.action.item;
    
    if (Site.template != 'compare') {
      $('[data-compare-delete="' + $id + '"]').removeClass('active').attr('data-compare-add', $id).removeAttr('data-compare-delete');
    } else {
      $('[data-compared-id=' + data.action.item + ']').fadeOut(300, function () {
        $(this).remove();
      });
    }
  
    alertify.message('Товар удален из сравнения');
  
  });
  
  EventBus.subscribe('overload:insales:compares', function (data) {
    alertify.warning('Достигнуто максимальное количество сравниваемых товаров - ' + data.maxItems);
  });
  
  EventBus.subscribe('update_items:insales:compares', function (data) {
  
    $compareCount.html(data.products.length);
  
  
    if (Site.template == 'compare') {
      if (data.products.length == 0) {
        $('.table-compare').fadeOut('slow').html('<div class="notice notice-info text-center">Список сравнения пуст</div>').fadeIn('slow');
        alertify.message('Список сравнения пуст');
      } else {
        $(compareWrapper).load(compareWrapper + ' ' + compareInner, function () {
          if (!$.cookie('compare-view')) {
            $(sameRows).hide();
            $(compareViewToggler).addClass('active');
          }
        });
      }
    }
  
    $('.preloader').fadeOut('fast', function () {
      $(this).remove();
    });
  
  });
  
  /**
   * COMPARE VIEW
   * Настройка переключалки видимости блоков
   * @type {string}
   */
  var compareViewToggler = '.js-same-toggle';
  var sameRows = '.same-row';
  
  if (!$.cookie('compare-view')) {
    $(sameRows).hide();
    $(compareViewToggler).addClass('active');
  }
  
  $(document).on('click', compareViewToggler, function (e) {
    e.preventDefault();
  
    $(compareViewToggler).toggleClass('active');
    $(sameRows).toggle();
  
    if (!$(this).hasClass('active')) {
      $.cookie("compare-view", 'true');
    } else {
      $.removeCookie("compare-view");
    }
  
  });


  // scroll top
  var scrollToTop =
  {
    /**
     * When the user has scrolled more than 100 pixels then we display the scroll to top button using the fadeIn function
     * If the scroll position is less than 100 then hide the scroll up button
     *
     * On the click event of the scroll to top button scroll the window to the top
     */
    init: function(  ){
  
      var target = $('#scroll-to-top');
  
      if ( $(window).scrollTop() > 500 && target.not('.active') ) {
        target.addClass('active');
      }
  
      //Check to see if the window is top if not then display button
      $(window).scroll(function(){
  
        if ( $(this).scrollTop() > 500 && target.not('.active') ) {
          target.addClass('active');
        } else {
          target.removeClass('active');
        }
  
      });
  
      // Click event to scroll to top
      target.click(function(e){
        e.preventDefault();
        $('html, body').animate({scrollTop : 0}, 500);
      });
    }
  };
  
  scrollToTop.init();


  /**
   * PROMO SLIDER
   * Слайдер на титульной странице
   * @type {Swiper|Window.Swiper}
   */
  var promoSwiper = new Swiper('.promo-swiper', {
    nextButton: '.promo-slider-next',
    prevButton: '.promo-slider-prev',
    autoplay: false,
    loop: true,
    effect: 'flip'
  });


  /**
   * TOOLTIPSTER
   * Инициализация скрипта всплывающих подсказок
   */
  $('.tooltip').tooltipster({
    theme: 'tooltipster-light'
  });


  /**
   * DISABLE HOVER ON SCROLL
   * Выключаем HOVER при скроллинге - небольшая оптимизация
   */
  $(function () {
    var timer;
    window.addEventListener('scroll', function () {
      clearTimeout(timer);
      if (!$('body').hasClass('disable-hover')) {
        $('body').addClass('disable-hover')
      }
      timer = setTimeout(function () {
        $('body').removeClass('disable-hover')
      }, 50);
    }, false);
  });


  /**
   * COLLAPSE
   * Простой переключатель классов для collapse блоков
   * Collapse работает на css
   */
  $('.is-collapse').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('active').next('.collapsible').toggleClass('active');
  });


  /**
   * PRICE SLIDER
   * Инициализация слайдера цен в фильтрах
   * @type {Element}
   */
  var priceSlider = document.getElementById('price-slider');
  
  if (priceSlider) {
  
    var inputPriceFrom = document.getElementById('price-from');
    var inputPriceTo = document.getElementById('price-to');
  
    $(priceSlider).ionRangeSlider({
      type: "double",
      onChange: function (data) {
        inputPriceFrom.value = data.from;
        inputPriceTo.value = data.to;
      },
      onFinish: function (data) {
        $(priceSlider).parents('form:first').submit();
      }
    });
  
    var slider = $(priceSlider).data("ionRangeSlider");
  
    inputPriceFrom.addEventListener('change', function () {
      slider.update({
        from: this.value
      });
    });
  
    inputPriceTo.addEventListener('change', function () {
      slider.update({
        to: this.value
      });
    });
  }


  /**
   * PERFECT SCROLLBAR INIT
   * JS Скроллбар - используется в блоках с фильтрами
   */
  $(function () {
    $('.scrollable').perfectScrollbar({
      suppressScrollY: false
    });
  });


  /**
   * PRODUCT SLIDER
   * Слайдер фоток товара
   * updateProductCardSlider - обновляет слайдер на карточках товара -
   * - необходимо в том случае, если мы как-то меняем вид/размеры карточки, например -
   * - в catalog-view
   */
  function updateProductCardSlider() {
    if ($('.product-card-slider').length) {
      if (productCardSlider.length) {
        for (var i = 0; i < productCardSlider.length; i++) {
          productCardSlider[i].update();
          productCardSlider[i].slideTo(0, 0);
        }
      } else {
        productCardSlider.update();
        productCardSlider.slideTo(0, 0);
      }
    }
  }
  
  if ($('#product-slider').length) {
    var productSlider = new Swiper('#product-slider', {
      nextButton: '.gt-next',
      prevButton: '.gt-prev',
      spaceBetween: 10,
      loop: true,
      loopedSlides: 3,
      setWrapperSize: true,
      effect: 'slide',
      lazyLoading: true
    });
  }
  
  if ($('#product-thumbs').length) {
    var productThumbs = new Swiper('#product-thumbs', {
      spaceBetween: 10,
      slidesPerView: 3,
      setWrapperSize: true,
      touchRatio: 0.2,
      centeredSlides: false,
      loop: true,
      loopedSlides: 3,
      slideToClickedSlide: true,
      lazyLoading: true
    });
    productSlider.params.control = productThumbs;
    productThumbs.params.control = productSlider;
  }
  
  if ($('.product-card-slider').length) {
    var productCardSlider = new Swiper('.product-card-slider', {
      preloadImages: false,
      lazyLoading: true,
      setWrapperSize: true,
      uniqueNavElements: true,
      nextButton: '.cg-next',
      prevButton: '.cg-prev'
    });
  }


  /**
   * CATALOG VIEW TIGGER
   * Переключатель вида каталога товаров - лист/сетка
   * Дополнительно обновляется слайдер карточки товара
   */
  if ($.cookie('collection-view') == 'list') {
    $('.collection-products .product-card').addClass('inline-card');
    $('.collection-view .list-link').toggleClass('active');
    updateProductCardSlider();
  }
  
  $('.view-trigger').on('click', function (e) {
    e.preventDefault();
  
    if (!$(this).hasClass('active')) {
      $('.view-trigger').toggleClass('active');
  
      var type = $(this).data('type');
  
      if (type == 'grid') {
        $('.collection-products .product-card').removeClass('inline-card');
        $.cookie("collection-view", 'grid');
      } else {
        $('.collection-products .product-card').addClass('inline-card');
        $.cookie("collection-view", 'list');
      }
    }
    updateProductCardSlider();
  });


  /**
   * TABS
   * Простые табы - переключаются только классы,
   * за всё прочее - отображение и тд - отвечает CSS
   */
  (function ($) {
  
    $(document).on('click', '[data-toggle="tabs"]', function (e) {
      e.preventDefault();
      var $this = $(this);
      var $target = $($this.attr('href'));
      $target.parent().children('.tab-block').removeClass('active');
      $this.parents('.tabs-menu').children('.tabs-item').removeClass('active');
      $this.parent().addClass('active');
      $target.addClass('active');
    });
  
  })(jQuery);


  /**
   * MOBILE TOOLBAR
   * Навигация для мобилок - инициация и контроль
   */
  
  // Left sidebar
  $(function () {
    $('.mobile-toolbar-trigger').on('click', function (e) {
      e.preventDefault();
      m.toolbar.toggle($(this));
    });
    m.backDrop.init();
  });
  
  // Mobile menu
  $(function () {
    var $mobileMenu = $('.mobile-menu');
    var $dropdownToggle = $mobileMenu.find(m.conf.dropdownToggleSelector);
    var $dropdownCloseParent = $mobileMenu.find(m.conf.dropdownCloseParentSelector);
    $dropdownToggle.on('click', function (e) {
      e.preventDefault();
      m.menu.dropdownToggle($(this));
    });
    $dropdownCloseParent.on('click', function (e) {
      e.preventDefault();
      m.menu.dropdownCloseParent($(this));
    });
  });
  
  // Collection menu
  $(function () {
    var $collectionMenu = $('.collection-menu');
    var $dropdownToggle = $collectionMenu.find(m.conf.dropdownToggleSelector);
    var $dropdownCloseParent = $collectionMenu.find(m.conf.dropdownCloseParentSelector);
    $dropdownToggle.on('click', function (e) {
      e.preventDefault();
      m.menu.dropdownToggle($(this));
    });
    $dropdownCloseParent.on('click', function (e) {
      e.preventDefault();
      m.menu.dropdownCloseParent($(this));
    });
  });
  
  /**
   * MOBILE TOOLBAR OBJ
   * Объект для работы с мобильной навигацией
   * В основном - переключает классы/видимость объектов
   * Боьшая часть анимаций сделана на css
   * Метод backDrop может использоватья отдельно (например юзается вместе с формой поиска)
   */
  var m = {
  
    conf: {
      toolbarSelector: '.mobile-toolbar',
      dropdownToggleSelector: '.dropdown-toggle',
      dropdownOpenSelector: '.dropdown-open',
      dropdownCloseSelector: '.dropdown-close',
      dropdownCloseParentSelector: '.dropdown-close-parent',
      dropdownMenuSelector: '.submenu'
    },
  
    backDrop: {
  
      init: function () {
        $(document).on('click', ('#backdrop'), function (e) {
          e.preventDefault();
          m.toolbar.close();
        });
      },
  
      toggle: function () {
        if ($('#backdrop').length) {
          m.backDrop.hide();
        } else {
          m.backDrop.show();
        }
      },
  
      show: function () {
        $('body').addClass('backdrop-opened');
        $('<div id="backdrop"></div>')
          .appendTo('body')
          .fadeIn('fast');
      },
  
      hide: function () {
        $('body').removeClass('backdrop-opened');
        $('#backdrop')
          .fadeOut('fast', function () {
            $(this).remove();
          });
      }
    },
  
    toolbar: {
  
      toggle: function ($obj) {
        $($obj).toggleClass('in');
        $(m.conf.toolbarSelector).toggleClass('opened');
        m.backDrop.toggle();
      },
  
      close: function ($obj) {
        $($obj).removeClass('in');
        $(m.conf.toolbarSelector).removeClass('opened');
        m.backDrop.hide();
      }
    },
  
    menu: {
  
      dropdownToggle: function ($obj) {
        $(m.conf.toolbarSelector).toggleClass('dropdown-opened');
        $obj
          .toggleClass("in")
          .next(m.conf.dropdownMenuSelector)
          .toggleClass("opened")
          .focus();
      },
  
      dropdownOpen: function ($obj) {
        $(m.conf.toolbarSelector).addClass('dropdown-opened');
        $obj
          .addClass("in")
          .next(m.conf.dropdownMenuSelector)
          .addClass("opened")
          .focus();
      },
  
      dropdownClose: function ($obj) {
        $(m.conf.menuSelector).removeClass('dropdown-opened');
        $obj
          .removeClass("in")
          .next(m.conf.dropdownMenuSelector)
          .removeClass("opened")
          .focus();
      },
  
      dropdownCloseParent: function ($obj) {
        $(m.conf.toolbarSelector).removeClass('dropdown-opened');
        $obj.parents(m.conf.dropdownMenuSelector + ':first').removeClass('opened').prev().removeClass('in');
      }
    }
  };


  /**
   * AJAX SEARCH
   * Живой поиск - вся его логика и события
   * Для вывода результатов использует template - lodash
   * @type {*|jQuery|HTMLElement}
   */
  var $searchResultsContainer = $('.ajax-search-results-wrapper');
  var $searchForm = $('.search-form');
  var $searchInput = $searchForm.find('.search-input');
  
  $(function () {
    AjaxSearch.setConfig({
      template: 'ajax-search',
      letters: 3,
      markerClass: 'marked',
      delay: 100
    });
  });
  
  EventBus.subscribe('before:insales:search', function () {
    if ($searchInput.val() != '') {
      $searchForm.addClass('loading');
    }
  });
  
  EventBus.subscribe('update:insales:search', function (data) {
  
    console.log(data);
  
    if ($searchInput.val() != '') {
      if (data.invalid) {
        $searchResultsContainer.html('<div class="notice notice-info search-notice">Строка для поиска слишком короткая</div>');
      } else if (data.empty) {
        $searchResultsContainer.html('<div class="notice notice-info search-notice">Ничего не найдено. Попробуйте изменить запрос.</div>');
      }
      $searchForm.removeClass('loading');
    }
  });
  
  $searchInput.on('focus', function (e) {
    e.preventDefault();
    if (!$('#backdrop').length) {
      $searchForm.addClass("active");
      m.backDrop.show();
    }
  });
  
  $(function () {
    $(document).on('click', '#backdrop', function (e) {
  
      if (!$(e.target).closest($searchForm).length) {
        $searchResultsContainer.html('');
        $searchInput.val('');
        setTimeout(function () {
          $searchForm
            .removeClass("active")
            .removeClass('loading');
        }, 100);
      }
    });
  });


  /**
   * NOTIFIER DEFAULT SETTINGS
   * Базовые параметры всплывающих JS-оповещений
   * @type {{modal: boolean, basic: boolean, frameless: boolean, movable: boolean, moveBounded: boolean, resizable: boolean, closable: boolean, closableByDimmer: boolean, maximizable: boolean, startMaximized: boolean, pinnable: boolean, pinned: boolean, padding: boolean, overflow: boolean, maintainFocus: boolean, transition: string, autoReset: boolean, notifier: {delay: number, position: string}, glossary: {title: string, ok: string, cancel: string}, theme: {input: string, ok: string, cancel: string}}}
   */
  alertify.defaults = {
    // dialogs defaults
    modal: true,
    basic: false,
    frameless: false,
    movable: true,
    moveBounded: false,
    resizable: true,
    closable: true,
    closableByDimmer: true,
    maximizable: true,
    startMaximized: false,
    pinnable: true,
    pinned: true,
    padding: true,
    overflow: true,
    maintainFocus: true,
    transition: 'fade',
    autoReset: true,
  
    // notifier defaults
    notifier: {
      // auto-dismiss wait time (in seconds)
      delay: 3,
      // default position
      position: 'top-right'
    },
  
    // language resources
    glossary: {
      // dialogs default title
      title: 'AlertifyJS',
      // ok button text
      ok: 'OK',
      // cancel button text
      cancel: 'Cancel'
    },
  
    // theme settings
    theme: {
      // class name attached to prompt dialog input textbox.
      input: 'ajs-input',
      // class name attached to ok button
      ok: 'ajs-ok',
      // class name attached to cancel button
      cancel: 'ajs-cancel'
    }
  };


  /**
   * SHOPPING CART
   * Настройка корзины, обновление информации, events, купоны
   */
  var $shopcartAmount = $('.js-shopcart-amount');
  var $shopcartSumm = $('.js-shopcart-summ');
  var $shopcartTotalSumm = $('.js-shopcart-total-summ');
  var $shopcartArea = $('.js-shopcart-area');
  var $shopcartTotalWeight = $('.js-total-weight');
  var $shopcartTotalPrice = $('.js-total-price');
  var $shopcartDiscountSumm = $('.js-discount-summ');
  
  EventBus.subscribe('before:insales:cart', function (data) {
    $('<div class="preloader is-white is-32"></div>').prependTo($shopcartArea).fadeIn('fast');
  });
  
  EventBus.subscribe('add_items:insales:cart', function (data) {
     if (data.action.fastorder == true) {
     //не показывать сообщение
    } else {
     alertify.success('Товар успешно добавлен в корзину');
    }   
  });
  
  EventBus.subscribe('set_items:insales:cart', function (data) {
    alertify.success('Количество товара в корзине изменено');
  });
  
  EventBus.subscribe('delete_items:insales:cart', function (data) {
  
    var itemId = data.action.items[0];
  
    $('<div class="preloader is-white is-32"></div>')
      .prependTo($('[data-item-id="' + itemId + '"]'))
      .fadeIn('fast');
  
    $('[data-item-id=' + itemId + ']').slideUp('fast', function () {
      $(this).remove();
    });
  
    alertify.success('Товар успешно удален из корзины');
  
    if (data.items_count == 0) {
      $('.shopping-cart.container').fadeOut('slow').html('<div class="notice notice-info text-center">Ваша корзина пуста</div>').fadeIn('slow');
      alertify.message('Корзина очищена');
    }
  
  });
  
  EventBus.subscribe('set_coupon:insales:cart', function (data) {
  
    var couponWrapper = '#js-coupon-wrapper';
    var couponInner = '#js-coupon-inner';
    var cartUrl = document.location.href;
  
    if (data.discounts.length == 0) {
  
      alertify.error('Введенный код не активен');
      $('.discount-comment').remove();
  
    } else {
  
      var discountAmount = '';
      var discountSumm = Shop.money.format(data.discounts[0].amount);
  
      if (data.discounts[0].percent != null) {
        discountAmount = Math.floor(data.discounts[0].percent) + ' %';
      } else {
        discountAmount = Shop.money.format(data.discounts[0].amount);
      }
  
      $('.discount-comment').remove();
      $('.cart-results ').prepend('<div class="summ-caption discount-comment">Cумма заказа: <span class="js-shopcart-summ">' + Shop.money.format(data.items_price) + '</span> + скидка <span class="discount-size">' + discountAmount + '</span><br> Сумма скидки: ' + discountSumm + ' </div>');
      alertify.success('Купон успешно примёнен');
    }
  
    $(couponWrapper).load(cartUrl + ' ' + couponInner);
  
  });
  
  EventBus.subscribe('update_items:insales:cart', function (data) {
    $shopcartAmount.html(data.items_count);
    $shopcartSumm.html(Shop.money.format(data.items_price));
    $shopcartTotalSumm.html(Shop.money.format(data.total_price));
    $shopcartTotalPrice.html(Math.floor(data.total_price));
    if (data.discounts.length > 0) {
      $shopcartDiscountSumm.html(Shop.money.format(data.discounts[0].amount));
    }
  });
  
  EventBus.subscribe('always:insales:cart', function (data) {
    $('.preloader').fadeOut('fast', function () {
      $(this).remove();
    });
  });
  
  EventBus.subscribe('update_variant:insales:item', function (data) {
  
    var $item = $(data.action.product);
    var $itemSumm = $item.find('.js-item-total-price');
    var $itemPrice = $item.find('.js-item-price');
  
    $itemPrice.html(Shop.money.format(data.action.price));
    $itemSumm.html(Shop.money.format(data.action.price * data.action.quantity.current));
  
    if (data.action.price != data.price && !$.cookie('priceType'+data.id)) {
      $.cookie('priceType' + data.id, 'true');
      if (data.action.price > data.price) {
        alertify.message('Базовая цена на "' + data.title + '" увеличена');
      } else {
        alertify.message('Базовая цена на "' + data.title + '" уменьшена');
      }
    } else if (data.action.price == data.price) {
      $.removeCookie('priceType'+data.id)
    }
  
    $('<div class="preloader is-white is-32"></div>')
      .prependTo($item)
      .fadeIn('fast');
  });


  /**
   * CATALOG FILTERS TRIGGERS
   * Триггеры для отправки формы фильтров
   */
  $('.js-filter-trigger').change(function (e) {
    e.preventDefault();
    $(this).parents('form:first').submit();
  });
  
  $('.js-filter-reset').on('click', function (e) {
    e.preventDefault();
    $(this).parents('.filters-block:first').find('.checkbox-field ').removeAttr('checked');
    $(this).parents('form:first').submit();
  });
  
  $('.js-price-reset').on('click', function (e) {
    e.preventDefault();
    $('.input-range').attr('disabled', true);
    $(this).parents('form:first').submit();
  });


  /**
   * AJAX MODAL CALLBACK
   * Модалка с заказом быстрого звонка
   * Обрабатывается через validate
   * Отправляется через API
   */
  $(".js-callback-open").magnificPopup({
    removalDelay: 200, //delay removal by X to allow out-animation
    callbacks: {
      beforeOpen: function () {
        this.st.mainClass = this.st.el.attr('data-effect');
      }
    },
    midClick: true
  });
  
  $('.phone-mask').inputmask('+9(999)999-99-99');
  
  var $formCallback = $('#callback-form');
  
  $formCallback.validate({
    errorClass: 'is-error',
    rules: {
      'name': {
        required: true,
        minlength: 3
      },
      'phone': {
        required: true,
        minlength: 13
      }
    },
    submitHandler: function (form) {
  
      $('<div class="preloader is-white is-64"></div>').appendTo($formCallback).show();
  
      Shop.sendMessage(
        $formCallback.serializeObject()
        )
        .done(function (response) {
          alertify.success(response.notice);
          $formCallback.trigger('reset');
          $('.preloader').fadeOut('fast', function () {
            $(this).remove();
          });
          $.magnificPopup.close();
        })
        .fail(function (response) {
          $.each(response.errors, function (i, val) {
            alertify.error(val[0]);
          });
        });
    }
  });


  /**
   * AJAX MODAL CHECKOUT
   * Модалка с оформением заказа из корзины
   * Обрабатывается через validate
   * Отправляется через API
   */
  $(".js-fast-checkout-open").magnificPopup({
    removalDelay: 200, //delay removal by X to allow out-animation
    callbacks: {
      beforeOpen: function () {
        this.st.mainClass = this.st.el.attr('data-effect');
      }
    },
    midClick: true
  });
  
  formFastCheckout = $('#fast-checkout-form');
  modalFastCheckout = $('#fast-checkout-modal');
  
  formFastCheckout.validate({
    errorClass: 'is-error',
    rules: {
      'name': {required: true, minlength: 3},
      'phone': {required: true, minlength: 13}
    },
    submitHandler: function (form) {
  
      // TODO: в будущем - заменить на метод из Cart
  
      var formData = formFastCheckout.serializeObject();
      var client = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
  
      var order = {
        delivery: formData.delivery,
        payment: formData.payment
      };
  
      ISnew.json.makeCheckout(client, order)
        .done(function (response) {
          alertify.success("Заказ успешно оформлен!");
          $('.js-shopcart-amount').html(0);
          $('.js-shopcart-summ').html(0);
          formFastCheckout.trigger('reset');
          $('.shopping-cart.container').fadeOut('fast').html('<div class="notice notice-info text-center">Ваша корзина пуста</div>').fadeIn('slow');
          $.magnificPopup.close();
        })
        .fail(function (response) {
          $.each(response.errors, function (i, val) {
            alertify.error(val[0]);
          });
        });
    }
  });


  /**
   * AJAX MODAL ORDER
   * Модалка с оформением заказа со страницы товара
   * Обрабатывается через validate
   * Отправляется через API
   */
  $(document).on('click', '.js-fast-order-open', function (e) {
    e.preventDefault();
  
    $.magnificPopup.close();
  
    setTimeout(function () {
  
      $.magnificPopup.open({
  
        items: {
          src: e.target.hash
        },
        removalDelay: 200, //delay removal by X to allow out-animation
        callbacks: {
          beforeOpen: function () {
            this.st.mainClass = e.target.dataset.effect;
          }
        },
        midClick: true
      });
  
    }, 300);
  
  });
  
  formFastOrder = $('#fast-order-form');
  modalFastOrder = $('#fast-order-modal');
  
  formFastOrder.validate({
    errorClass: 'is-error',
    rules: {
      'name': {required: true, minlength: 3},
      'phone': {required: true}
    },
    submitHandler: function (form) {
  
      productOrder = $('.product-order');
  
      var productData = productOrder.serializeObject();
      var formData = formFastOrder.serializeObject();
  
      var task = {
        items: {},
        fastorder: true
      };
  
      task.items[productData.variant_id] = productData.quantity;
  
      if (formData.phone.indexOf('_') == -1) {
        $('<div class="preloader is-white is-64"></div>').appendTo(formFastOrder).fadeIn('fast');
        Cart.add(task);
      }
    }
  });
  
  EventBus.subscribe('add_items:insales:cart', function (data) {
  
    if (data.action.fastorder == true) {
      var formData = formFastOrder.serializeObject();
      var client = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
  
      var order = {
        delivery: formData.delivery,
        payment: formData.payment
      };
  
      ISnew.json.makeCheckout(client, order)
        .done(function (response) {
          alertify.success("Заказ успешно оформлен!");
          $('.js-shopcart-amount').html(0);
          $('.js-shopcart-summ').html(0);
          formFastOrder.trigger('reset');
          Cart.clear();
          $.magnificPopup.close();
        })
        .fail(function (response) {
          $.each(response.errors, function (i, val) {
            alertify.error(val[0]);
          });
        });
    }
  });


  /**
   * AJAX MODAL PRODUCT PREVIEW
   * Модалка с быстрым просмотром товара
   * Шаблон лежит в templates - в виде lodash
   * Задержка после скрытия модалки важна - она даёт время для подготовки другой модалки -
   * быстрого заказа, если бы ход был через кнопку быстрого заказа
   */
  $previewModal = $('#fast-preview-modal');
  $previewModalInner = $previewModal.find('.modal-inner');
  var productSliderFast = {};
  
  $(".js-fast-preview").magnificPopup({
    removalDelay: 200,
    callbacks: {
      beforeOpen: function () {
        var currentPopup = $.magnificPopup.instance;
        var $fastPreviewButton = currentPopup.st.el;  
       
  
        this.st.mainClass = this.st.el.attr('data-effect');
  
        var productId = this.st.el.attr('data-product-id');
  
        $('<div class="preloader is-white is-64"></div>').appendTo($previewModalInner).show();
  
        Products.get(productId)
  
          .done(function (product) {
  
            $previewModalInner
              .html(Template.render(product, 'fast-preview'))
              .append();
  
            setTimeout(function () {
  
              if ($('#product-slider-fast').length) {
                productSliderFast = new Swiper('#product-slider-fast', {
                  nextButton: '.gt-next-fast',
                  prevButton: '.gt-prev-fast',
                  spaceBetween: 10,
                  loop: true,
                  setWrapperSize: true,
                  uniqueNavElements: true,
                  loopedSlides: 3,
                  effect: 'slide',
                  lazyLoading: true
                });
              }
  
              if ($('#product-thumbs-fast').length) {
                var productThumbsFast = new Swiper('#product-thumbs-fast', {
                  spaceBetween: 10,
                  slidesPerView: 3,
                  setWrapperSize: true,
                  touchRatio: 0.2,
                  centeredSlides: false,
                  loop: true,
                  loopedSlides: 3,
                  slideToClickedSlide: true,
                  lazyLoading: true
                });
                productSliderFast.params.control = productThumbsFast;
                productThumbsFast.params.control = productSliderFast;
              }
  
              $('.popup-gallery-fast').on('click', function (e) {
                e.preventDefault();
  
                var $gallery = $('#product-slider-fast').find('img');
                 var imgIndex = $('#product-thumbs-fast').find('img[src="'+$(this).find('img').attr('src').replace('large','compact')+'"]').parents('.swiper-slide').index();
  
                console.log($gallery);
  
                var galleryItems = [];
  
                for (i = 0; i < $gallery.length; i++) {
                  var imageUrl = '';
                  if ($gallery[i].src == '') {
                    imageUrl = $gallery[i].dataset.src;
                  } else {
                    imageUrl = $gallery[i].src;
                  }
                  galleryItems.push({src: imageUrl});
                }
  
                  if ($gallery.length < 2) {
                    imgIndex = 0;
                  }
                $.magnificPopup.close();
  
                setTimeout(function () {
                  $.magnificPopup.open({
                    items: galleryItems,
                    type: 'image',
                    tLoading: 'Загрузка #%curr%...',
                    mainClass: 'mfp-img-mobile',
                    removalDelay: 200,
                    midClick: true,
                    callbacks: {
                      beforeOpen: function () {
                        // just a hack that adds mfp-anim class to markup
                        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                        this.st.mainClass = $(e.target).parent().data('effect');
                      },
                      afterClose: function(){
                        $fastPreviewButton.trigger('click')
                      }
                    },
                    gallery: {
                      enabled: true,
                      navigateByImgClick: true,
                      preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
                    },
                    image: {
                      tError: '<a href="%url%">Изображение #%curr%</a> не загружено.',
                      titleSrc: function (item) {
                        return $(e.target).attr('title');
                      }
                    }
                  }, imgIndex);
                }, 300);
              });
  
              product._init();
  
            }, 0);
  
            $('.preloader').fadeOut('fast', function () {
              $(this).remove();
            });
  
          })
  
          .fail(function (response) {
            $previewModalInner.html('Не удалось загрузить товар');
          });
      }
    },
    midClick: true
  });


  /**
   * PRODUCT API
   * События для работы с классом product
   * product-order - вспомогательный класс-обёртка, для API не обязателен
   * @type {*|jQuery|HTMLElement}
   */
  EventBus.subscribe('update_variant:insales:product', function (data) {
  	var $productOrder = $(data.action.product[0]).parents('.product-page'),
        $price = $productOrder.find('.js-product-price'),
        $oldPrice = $productOrder.find('.js-product-old-price'),
        $sku = $productOrder.find('.js-product-sku'),
        $label = $productOrder.find('.js-discaund-label');
  
    $price.html(Shop.money.format(data.action.price));
    if (data.old_price === '0.0' || data.old_price === null) {
      $oldPrice.removeClass('active');
      $label.removeClass('active');
    } else {
      $oldPrice.addClass('active').html(Shop.money.format(data.old_price));
      if (data.old_price > data.action.price) $label.addClass('active').html('-'+ Math.round(((data.old_price - data.action.price) / data.old_price) * 100) +'%');
    }
    $sku.html(data.sku);
    
    if ($('#product-slider').length && data.image_id !== null) productSlider.slideTo($('[data-img-id='+ data.image_id +']').data('swiper-slide-index'));
    if ($('#product-slider-fast').length && data.image_id !== null) productSliderFast.slideTo($('[data-img-id='+ data.image_id +']').data('swiper-slide-index'));
  
  });
  
  if (window.location.hash == "#review_form") {
    $('.tabs-item, .tab-block').removeClass('active');
    $('.tabs-item:last, .tab-block:last').addClass('active');
    $('.js-toggle-review, .js-review-wrapper').addClass('active');
  }


  /**
   * LIGHTBOX GALLERY BY MAGNIFIC POPUP
   */
  $('.popup-gallery').magnificPopup({
    type: 'image',
    tLoading: 'Загрузка #%curr%...',
    mainClass: 'mfp-img-mobile',
    removalDelay: 200,
    midClick: true,
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
        this.st.mainClass = this.st.el.attr('data-effect');
      }
    },
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Изображение #%curr%</a> не загружено.',
      titleSrc: function (item) {
        return item.el.attr('title');
      }
    }
  });



  function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
  }


});
