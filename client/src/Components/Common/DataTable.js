// noinspection JSValidateTypes, JSUnusedAssignment
import React, { useState, Fragment, useRef, useLayoutEffect } from "react";
import Util from "./Converter";
import { Listbox } from "@headlessui/react";
import { Menu } from "@headlessui/react";
import Pager from "./Pager";

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const Card = {
  header: ({ item, actions }) => (
    <li className={`header-row`}>
      {Object.keys(item).map((k) => (
        <span className={`sdt-${Util.camel.toDash(k)}`} key={k}>
          {Util.camel.toSpace(k)}
        </span>
      ))}
      {!Util.object.isEmpty(actions.individual) && (
        <span className="sdt-actions" />
      )}
    </li>
  ),
  item: ({ item, actions }) => (
    <li className={item.selected === true ? `data-row red-bg` : `data-row`}>
      {Object.entries(item).map(([k, v]) => {
        let phones = ""
        if(Util.camel.toDash(k) == "phone"){
          const pns = Util.object.toLabel(v).split(" ").map((p) => {
            const ch = `${p.slice(0, -3)}***`;
            phones += ch;
            return `${p.slice(0, -3)}***`;
          })
        }

        return (
          Util.camel.toDash(k) !== "phone" ? (
            <span
              title={`${Util.object.toLabel(v)}***`}
              className={`sdt-${Util.camel.toDash(k)}`}
              key={k}
            >
              {Util.object.toLabel(v)}
            </span>
          ) : (
            <span
              title={phones}
              className={`sdt-${Util.camel.toDash(k)}`}
              key={k}
            >
              {Util.object.toLabel(v).replace(/\s\s+/g, ' ').split(" ").map((num) => {
                const hiddenNumber = `${num.slice(0, -3)}***`
                const user = getCookie("user");
                const setNumber = user == "tornike_autobase" ? num : hiddenNumber;

                return (
                  <a href={`tel:${num}`} key={setNumber}> {setNumber} </a>
                )
              })}
            </span>
          )
        )
      })}
      {!Util.object.isEmpty(actions.individual) && (
        <Menu as="span" className="sdt-actions">
          <Menu.Button as="div" className="sdt-actions-toggle">
            {/* <i className="fa fa-ellipsis-v"/> */}
            <svg
              fill="#ffffff"
              aria-hidden="true"
              height="40px"
              width="12px"
              version="1.1"
              id="Icons"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
              xmlSpace="preserve"
            >
              <g>
                <path d="M16,10c1.7,0,3-1.3,3-3s-1.3-3-3-3s-3,1.3-3,3S14.3,10,16,10z" />
                <path d="M16,13c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S17.7,13,16,13z" />
                <path d="M16,22c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S17.7,22,16,22z" />
              </g>
            </svg>
          </Menu.Button>
          <Menu.Items className="sdt-actions-popup" as="ul">
            {Object.entries(actions.individual).map(
              ([k, v]) =>
                v.enabled(item) && (
                  <Menu.Item key={k}>
                    {({ active }) => (
                      <li
                        onClick={() => v.action(item)}
                        className={`${active ? "popup-menu-active" : ""}`}
                      >
                        {Util.camel.toSpace(k)}
                      </li>
                    )}
                  </Menu.Item>
                )
            )}
          </Menu.Items>
        </Menu>
      )}
    </li>
  ),
};

const SimpleDataTable = ({
  items,
  card,
  cardHeader,
  filterables = [],
  searchable = [],
  size = 10,
  actions = { main: {}, individual: {} },
}) => {
  const [filter, setFilter] = useState({});
  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(0);
  const simple = useRef();

  useLayoutEffect(() => {
    if (!simple.current) return;
    const marks = simple.current.querySelectorAll(
      "ul.simple-data-rows > li.data-row > span:not(.sdt-actions) strong.search-mark"
    );
    Util.array
      .unique(Array.from(marks).map((m) => m.parentNode))
      .forEach((p) => (p.innerHTML = p.innerText));
    if (!searchKey) return;
    const leaves = simple.current.querySelectorAll(
      "ul.simple-data-rows > li.data-row > span:not(.sdt-actions):not(:has(*)), ul.simple-data-rows > li.data-row > span:not(.sdt-actions) *:not(:has(*))"
    );
    leaves.forEach((s) => (s.innerHTML = mark(s.innerText)));
  });

  const TopBar = ({ children }) => (
    <div className={`top-bar`}>
      <div className={`actions`}>
        {Object.entries(actions.main).map(([k, v]) => (
          <button onClick={v} key={k} className={`sdt-${Util.camel.toDash(k)}`}>
            {Util.camel.toSpace(k)}
          </button>
        ))}
      </div>
      {children}
    </div>
  );

  if (!items.length)
    return (
      <div className="simple-data-table">
        <TopBar />
        <div className="sdt-empty">No items to display</div>
      </div>
    );

  const filters = filterables.map((f) => ({
    name: f,
    options: Util.array.unique(items.map((i) => i[f])),
  }));
  filters.forEach((f) => {
    f.options = [{ id: -1, name: `All ${f.name}` }, ...f.options];
    if (filter[f.name] && f.options.some((fo) => fo.id === filter[f.name].id))
      return;
    filter[f.name] = f.options[0];
    setFilter(filter);
  });

  const mark = (s) => {
    return s.replace(
      new RegExp(
        [searchKey]
          .map(function (x) {
            return x.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
          })
          .join("|"),
        "gi"
      ),
      '<strong class="search-mark">$&</strong>'
    );
  };

  const shown = items
    .filter((i) =>
      Object.entries(filter).every(([k, v]) => v.id === -1 || i[k].id === v.id)
    )
    .filter((i) =>
      searchable.length
        ? searchable.some((c) => Util.object.has(i[c], searchKey))
        : true
    );

  Object.entries(actions.individual).forEach(
    ([k, v]) =>
    (actions.individual[k] = Util.object.isObject(v)
      ? v
      : {
        action: v,
        enabled: () => true,
      })
  );

  cardHeader = cardHeader ? cardHeader : Util.func.empty;
  card = card && cardHeader ? { header: cardHeader, item: card } : Card;

  const handle = {
    filter: (k, v) => {
      setFilter({ ...filter, [k]: v });
      setPage(0);
    },
    search(e) {
      if (e.key !== "Enter") return;
      setSearchKey(e.target.value);
      setPage(0);
    },
  };

  return (
    <div className={`simple-data-table`} ref={simple}>
      <TopBar>
        {searchable.length > 0 && (
          <div className={"sdt-search"}>
            <input
              type="text"
              placeholder={"ძებნა"}
              className={"form-control"}
              defaultValue={searchKey}
              onKeyDown={handle.search}
            />
          </div>
        )}
        <div className={`sdt-filters`}>
          {filters.map((f) => (
            <div className={`sdt-filter`} key={f.name}>
              <Listbox
                value={filter[f.name]}
                key={filter[f.name].id}
                onChange={(v) => handle.filter(f.name, v)}
              >
                <Listbox.Button>
                  <span>{filter[f.name].name}</span>
                </Listbox.Button>
                <Listbox.Options>
                  {f.options.map((s) => (
                    <Listbox.Option key={s.id} value={s} as={Fragment}>
                      {({ active }) => (
                        <li className={`${active ? "popup-menu-active" : ""}`}>
                          {s.name}
                        </li>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
          ))}
        </div>
      </TopBar>
      <ul className={`simple-data-rows`}>
        <card.header item={items[0]} actions={actions} />
        {shown.slice(page * size, (page + 1) * size).map((item) => (
          <card.item key={item.id} item={item} actions={actions} />
        ))}
      </ul>
      <Pager size={size} page={page} count={shown.length} setPage={setPage} />
    </div>
  );
};

export default SimpleDataTable;
