export default function Popup() {
  return (
    <div className="container mx-auto mt-40 px-6">
      <div className="mb-8">
        <h1 className="relative mb-4 text-3xl font-bold leading-tight md:text-5xl md:leading-tight">
          Popup menu
        </h1>
        <p>
          Welcome to the popup! Take a look at the menu below and have your
          order ready to give to me at the window.
        </p>
      </div>
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Latte</h2>
        <p>
          Options: oat milk | whole milk | pumpkin spice syrup | honey | iced
        </p>
      </div>
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Cortado or Cappuccino</h2>
      </div>
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Salted caramel hot cocoa</h2>
      </div>
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Hot apple cider</h2>
      </div>
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Tea</h2>
        <p>Options: autumn spice | english breakfast | mint | berry</p>
      </div>
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Caramel roll</h2>
        <p>
          A deliciously warm sweet roll with cinnamon and caramel (or is it
          carmel?)
        </p>
      </div>
    </div>
  );
}
