/*<![CDATA[*/
(function () {
  var scriptURL =
    "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }
  function loadScript() {
    var script = document.createElement("script");
    script.async = true;
    script.src = scriptURL;
    (
      document.getElementsByTagName("head")[0] ||
      document.getElementsByTagName("body")[0]
    ).appendChild(script);
    script.onload = ShopifyBuyInit;
  }
  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: "codegregg.myshopify.com",
      storefrontAccessToken: "f08a3409c3b6471c0f3cd718e7651446",
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent("product", {
        id: "6888022179862",
        node: document.getElementById("product-component-1631655763917"),
        moneyFormat: "%24%7B%7Bamount%7D%7D",
        options: {
          product: {
            styles: {
              product: {
                "@media (min-width: 601px)": {
                  "max-width": "100%",
                  "margin-left": "0",
                  "margin-bottom": "50px",
                },
                "text-align": "left",
              },
              title: {
                "font-size": "26px",
              },
              button: {
                "font-weight": "bold",
                ":hover": {
                  "background-color": "#ff0202",
                },
                "background-color": "#c40101",
                ":focus": {
                  "background-color": "#ff0202",
                },
                "border-radius": "6px",
              },
              price: {
                "font-size": "18px",
              },
              compareAt: {
                "font-size": "15.299999999999999px",
              },
              unitPrice: {
                "font-size": "15.299999999999999px",
              },
            },
            layout: "horizontal",
            contents: {
              img: false,
              imgWithCarousel: true,
              description: true,
            },
            width: "100%",
            text: {
              button: "Add to cart",
            },
          },
          productSet: {
            styles: {
              products: {
                "@media (min-width: 601px)": {
                  "margin-left": "-20px",
                },
              },
            },
          },
          modalProduct: {
            contents: {
              img: false,
              imgWithCarousel: true,
              button: false,
              buttonWithQuantity: true,
            },
            styles: {
              product: {
                "@media (min-width: 601px)": {
                  "max-width": "100%",
                  "margin-left": "0px",
                  "margin-bottom": "0px",
                },
              },
              button: {
                "font-weight": "bold",
                ":hover": {
                  "background-color": "#ff0202",
                },
                "background-color": "#c40101",
                ":focus": {
                  "background-color": "#ff0202",
                },
                "border-radius": "6px",
              },
              title: {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "bold",
                "font-size": "26px",
                color: "#4c4c4c",
              },
              price: {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "normal",
                "font-size": "18px",
                color: "#4c4c4c",
              },
              compareAt: {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "normal",
                "font-size": "15.299999999999999px",
                color: "#4c4c4c",
              },
              unitPrice: {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "normal",
                "font-size": "15.299999999999999px",
                color: "#4c4c4c",
              },
            },
            text: {
              button: "Add to cart",
            },
          },
          option: {},
          cart: {
            styles: {
              button: {
                "font-weight": "bold",
                ":hover": {
                  "background-color": "#ff0202",
                },
                "background-color": "#c40101",
                ":focus": {
                  "background-color": "#ff0202",
                },
                "border-radius": "6px",
              },
              title: {
                color: "#383838",
              },
              header: {
                color: "#383838",
              },
              lineItems: {
                color: "#383838",
              },
              subtotalText: {
                color: "#383838",
              },
              subtotal: {
                color: "#383838",
              },
              notice: {
                color: "#383838",
              },
              currency: {
                color: "#383838",
              },
              close: {
                color: "#383838",
                ":hover": {
                  color: "#383838",
                },
              },
              empty: {
                color: "#383838",
              },
              noteDescription: {
                color: "#383838",
              },
              discountText: {
                color: "#383838",
              },
              discountIcon: {
                fill: "#383838",
              },
              discountAmount: {
                color: "#383838",
              },
            },
            text: {
              total: "Subtotal",
              button: "Checkout",
            },
          },
          toggle: {
            styles: {
              toggle: {
                "font-weight": "bold",
                "background-color": "#c40101",
                ":hover": {
                  "background-color": "#ff0202",
                },
                ":focus": {
                  "background-color": "#ff0202",
                },
              },
            },
          },
          lineItem: {
            styles: {
              variantTitle: {
                color: "#383838",
              },
              title: {
                color: "#383838",
              },
              price: {
                color: "#383838",
              },
              fullPrice: {
                color: "#383838",
              },
              discount: {
                color: "#383838",
              },
              discountIcon: {
                fill: "#383838",
              },
              quantity: {
                color: "#383838",
              },
              quantityIncrement: {
                color: "#383838",
                "border-color": "#383838",
              },
              quantityDecrement: {
                color: "#383838",
                "border-color": "#383838",
              },
              quantityInput: {
                color: "#383838",
                "border-color": "#383838",
              },
            },
          },
        },
      });
    });
  }
})();
/*]]>*/
