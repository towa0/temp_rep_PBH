import React, { useState, useEffect } from "react";
import productData from "./PersoonsBusjeHuren.json";
import { BiGasPump, BiUser, BiChevronRight } from "react-icons/bi";
import { TbManualGearbox } from "react-icons/tb";
import { FaRegSnowflake, FaFilter } from "react-icons/fa";
import { AiFillCar } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import { MdOutlineLocationOn } from "react-icons/md";

const iconGrid = [
  {
    icon: <BiGasPump className="ml-[3px]" />,
    label: "Benzine",
    specKey: "engine",
  },
  { icon: <BiUser />, label: "5 zitplaatsen", specKey: "stoelen" },
  { icon: <MdOutlineLocationOn />, label: "Locatie", specKey: "location" },
  { icon: <TbManualGearbox />, label: "Automatisch", specKey: "gearType" },
  { icon: <FaRegSnowflake />, label: "Airco", specKey: "aircoBool" },
  { icon: <AiFillCar />, label: "4 deuren", specKey: "aantalDeuren" },
];

const provinces = [
  "Drenthe",
  "Flevoland",
  "Friesland",
  "Gelderland",
  "Groningen",
  "Limburg",
  "Noord-Brabant",
  "Noord-Holland",
  "Overijssel",
  "Utrecht",
  "Zeeland",
  "Zuid-Holland",
];

const options = [
  { label: "Trekhaak", value: "trekhaak" },
  { label: "Schakel", value: "schakel" },
  { label: "Airco", value: "airco" },
  { label: "Navigatie", value: "navigatie" },
  { label: "Bluetooth", value: "bluetooth" },
  { label: "Standaard", value: "default" }, // Add the default option
];

const priceOptions = [
  { label: "Laagste naar hoogste", value: "lowest-to-highest" },
  { label: "Hoogste naar laagste", value: "highest-to-lowest" },
];

const BusjesHuren = () => {
  // State hooks
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedSort, setSelectedSort] = useState("lowest-to-highest");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("default"); // Default to "Standaard"

  // Event handlers
  const toggleDetails = (productId) => {
    setExpandedProduct((prevState) =>
      prevState === productId ? null : productId
    );
  };

  const handleClickOutside = () => {
    setExpandedProduct(null);
  };

  const handleFilterClick = () => {
    setShowFilters((prevState) => !prevState);
  };

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
  };

  const handleOptionChange = (option) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((item) => item !== option)
        : [...prevOptions, option]
    );
  };

  // Filtered products based on selected province and options
  const filteredProducts = productData.filter((product) => {
    const { location, extras } = product.specs;

    if (selectedProvince && location !== selectedProvince) {
      return false;
    }

    if (selectedOptions.length > 0) {
      const productOptions = extras.map((option) => option.toLowerCase());
      const hasAllOptions = selectedOptions.every((option) =>
        productOptions.includes(option)
      );
      return hasAllOptions;
    }

    return true;
  });

  useEffect(() => {
    const filteredProducts = productData.filter((product) => {
      const { location, extras } = product.specs;

      if (selectedProvince && location !== selectedProvince) {
        return false;
      }

      if (selectedOptions.length > 0) {
        const productOptions = extras.map((option) => option.toLowerCase());
        const hasAllOptions = selectedOptions.every((option) =>
          productOptions.includes(option)
        );
        return hasAllOptions;
      }

      return true;
    });

    // Apply sorting based on selectedPriceFilter and set the sorted products
    let sortedProductsCopy = [...filteredProducts];
    if (selectedPriceFilter === "lowest-to-highest") {
      sortedProductsCopy.sort((a, b) => a.price - b.price);
    } else if (selectedPriceFilter === "highest-to-lowest") {
      sortedProductsCopy.sort((a, b) => b.price - a.price);
    }

    setSortedProducts(sortedProductsCopy);
  }, [selectedProvince, selectedOptions, selectedPriceFilter]);

  return (
    <div className="w-full h-screen bg-white mt-10">
      <div className="car-page-title pb-4">
        <h1>
          Ideale auto's{" "}
          <span className="text-[#6e47cf] ">voor een weekendje weg</span>
        </h1>
      </div>

      <div className="filter-container max-w-[600px] bg-gray-100 p-3 rounded-md mx-auto mb-8 flex justify-center items-center">
        <div className="flex-1 flex">
          <select
            className="flex-1 mr-2"
            value={selectedOptions}
            onChange={(e) => setSelectedOptions(e.target.value)}
          >
            <option value="">Extra's</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="flex-1 mr-2"
            value={selectedPriceFilter}
            onChange={(e) => setSelectedPriceFilter(e.target.value)}
          >
            <option value="">Prijsbereik</option>
            {priceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="flex-1 mr-2"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="">Provincie</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        <button
          className="px-4 py-2 bg-[#6e47cf] hover:bg-[#5029b4] text-white rounded-md font-bold"
          onClick={() => {
            setShowFilters(false);
            setSortedProducts(filteredProducts); // Reset sorting when applying filters
          }}
        >
          Toepassen
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-[1280px] mx-auto">
        {sortedProducts.map((product) => (
          <div key={product.id}>
            <div className="car-container p-3 mx-7 border-2 mb-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="mb-2 text-[#3e257c]">
                Prijs{" "}
                <span className="text-xl font-bold text-[#ff1e1e]">
                  €{product.price},-
                </span>
              </p>
              <img
                src={product.image}
                alt={product.name}
                className="w-[350px] h-[175px] mb-2 object-contain"
              />
              <p className="mb-2 text-gray-400">
                Minimale leeftijd bestuurder 21 jaar
              </p>
              <p className="mb-2 text-gray-400">
                Trekhaak en all-season banden op aanvraag
              </p>
              <div className="grid grid-cols-2 gap-2">
                {iconGrid.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center mr-auto"
                  >
                    <div className="icon text-[#3e257c]">{item.icon}</div>
                    <span className="text-gray-600 ml-1">
                      {product.specs[item.specKey]}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 py-3 px-4 bg-[#6e47cf] hover:bg-[#5029b4] text-white border w-full rounded-md font-bold hover:underline">
                Reserveer dit voertuig
              </button>
              <button
                className="flex text-[#6e47cf] font-light hover:underline hover:text-[#3e257c] cursor-pointer mx-auto text-sm mt-1 pt-2"
                onClick={() => toggleDetails(product.id)}
              >
                Bekijk details
                <BiChevronRight size={25} />
              </button>

              {expandedProduct === product.id && (
                <div
                  className="overlay active"
                  onClick={() => setExpandedProduct(null)}
                >
                  <div
                    className="overlay-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="close-button"
                      onClick={() => toggleDetails(product.id)}
                    >
                      X
                    </button>
                    <div className="flex">
                      <div className="w-1/3">
                        <h2 className=" flex text-xl font-semibold">
                          <MdOutlineLocationOn className=" mr-2 mt-1 mb-3 " />
                          {product.specs.location}
                        </h2>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-auto object-contain mb-4"
                        />
                        <div className="bg-gray-100 rounded-lg p-4 mb-4">
                          <p className="text-[#3e257c] text-2xl font-bold mb-2 flex justify-end">
                            €{product.price},00 totaal
                          </p>
                          <p className="text-gray-600 text-sm font-light flex justify-end">
                            €{product.price},00 per dag
                          </p>
                        </div>
                        <button className=" py-3 px-4 mb-4 bg-[#6e47cf] hover:bg-[#5029b4] text-white border w-full rounded-lg font-bold hover:underline">
                          Verder
                        </button>
                        <div className="w-full bg-white border border-gray-300 p-4 rounded-lg">
                          <h3 className="text-xl font-semibold mb-4">
                            Prijzen zijn inclusief:
                          </h3>
                          <p className="mb-2 flex">
                            <BsCheck size={20} className="mt-1" />
                            100 km per dag
                          </p>
                          <p className="mb-2 flex">
                            <BsCheck size={20} className="mt-1" />
                            Pechhulp
                          </p>
                          <p className="mb-2 flex">
                            <BsCheck size={20} className="mt-1" />
                            Verzekeringen
                          </p>
                          <p className="mb-2 flex">
                            <BsCheck size={20} className="mt-1" />
                            Kan geleverd worden buiten openingsuren
                          </p>
                        </div>
                      </div>
                      <div className="w-2/3">
                        <h2 className="flex items-center justify-center text-3xl font-bold text-[#6e47cf] mb-7">
                          {product.name}
                        </h2>

                        <div className="flex flex-col mb-6 ml-4">
                          <h3 className="text-xl font-semibold mb-2">
                            Informatie over de auto:
                          </h3>
                          <div className="flex items-center mb-2">
                            {iconGrid.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center mr-4 text-[#3e257c] mb-4"
                              >
                                {item.icon}
                                <span className="ml-1">
                                  {product.specs[item.specKey]}
                                </span>
                              </div>
                            ))}
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            Kenmerken:
                          </h3>

                          <div className="flex flex-wrap items-center">
                            {product.specs.extras.map((extra, index) => (
                              <div
                                key={index}
                                className="flex items-center mb-2 mr-4 text-[#3e257c]"
                              >
                                <span>{extra}</span>
                                {index !== product.specs.extras.length - 1 && (
                                  <span>,</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusjesHuren;
