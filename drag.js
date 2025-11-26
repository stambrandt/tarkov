const dragElement = (element, dragzone) => {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    const dragMouseUp = () => {
      document.onmouseup = null;
      document.onmousemove = null;

      element.classList.remove("drag");
    };

    const dragMouseMove = (event) => {

      event.preventDefault();
      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;
      element.style.top = `${element.offsetTop - pos2}px`;
      element.style.left = `${element.offsetLeft - pos1}px`;
    };

    const dragMouseDown = (event) => {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();

      if (tagName === 'input' || tagName === 'select' || tagName === 'button' || tagName === 'textarea') {
        return;
      }

      event.preventDefault();

      pos3 = event.clientX;
      pos4 = event.clientY;

      element.classList.add("drag");

      document.onmouseup = dragMouseUp;
      document.onmousemove = dragMouseMove;
    };

    dragzone.onmousedown = dragMouseDown;
  };

  const dragable = document.getElementById("dragable"),
    dragzone = document.getElementById("dragzone");

  dragElement(dragable, dragzone);

  window.addEventListener("DOMContentLoaded", () => {
    const tabList = document.querySelector('[role="tablist"]');
    const tabs = tabList.querySelectorAll(':scope > [role="tab"]');
  
    tabs.forEach((tab) => {
      tab.addEventListener("click", changeTabs);
    });
  
    let tabFocus = 0;
  
    tabList.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        tabs[tabFocus].setAttribute("tabindex", -1);
        if (e.key === "ArrowRight") {
          tabFocus++;
          if (tabFocus >= tabs.length) {
            tabFocus = 0;
          }
        } else if (e.key === "ArrowLeft") {
          tabFocus--;
          if (tabFocus < 0) {
            tabFocus = tabs.length - 1;
          }
        }
  
        tabs[tabFocus].setAttribute("tabindex", 0);
        tabs[tabFocus].focus();
      }
    });
  });
  
  function changeTabs(e) {
    const targetTab = e.target;
    const tabList = targetTab.parentNode;
    const tabGroup = tabList.parentNode;
  
    tabList
      .querySelectorAll(':scope > [aria-selected="true"]')
      .forEach((t) => t.setAttribute("aria-selected", false));
  
    targetTab.setAttribute("aria-selected", true);
  
    tabGroup
      .querySelectorAll(':scope > [role="tabpanel"]')
      .forEach((p) => p.setAttribute("hidden", true));
  
    tabGroup
      .querySelector(`#${targetTab.getAttribute("aria-controls")}`)
      .removeAttribute("hidden");
  }
  