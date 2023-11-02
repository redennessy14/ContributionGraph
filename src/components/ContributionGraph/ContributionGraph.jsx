import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ContributionGraph.css";

const ContributionGraph = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://dpg.gg/test/calendar.json");
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error("Ошибка получения данных:", error);
      }
    };

    fetchData();
  }, []);

  if (data === null) {
    return <div>Загрузка данных...</div>;
  }

  const getDayOfWeekFromDate = (dateString) => {
    const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const date = new Date(dateString);
    const dayOfWeek = days[date.getDay()];
    return dayOfWeek;
  };

  const getMonthNameFromDate = (dateString) => {
    const months = [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июнь",
      "Июль",
      "Авг",
      "Сен",
      "Окт",
      "Нояб",
      "Дек",
    ];
    const date = new Date(dateString);
    const month = months[date.getMonth()];
    return month;
  };

  const createCalendar = () => {
    const calendar = [];

    for (let i = 0; i < 7; i++) {
      const week = [];

      for (let j = 0; j < 51; j++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 7 * 51 + (i + 7 * j));

        const dayOfWeek = getDayOfWeekFromDate(
          currentDate.toISOString().split("T")[0]
        );
        const monthName = getMonthNameFromDate(
          currentDate.toISOString().split("T")[0]
        );

        const contributions =
          data[currentDate.toISOString().split("T")[0]] || 0;
        const hasContributions = contributions > 0;

        const dayOfMonth = currentDate.getDate();
        const year = currentDate.getFullYear();

        let colorClass = "no-contributions";
        let tooltipText2 = `${dayOfWeek} ${monthName} ${dayOfMonth}, ${year}`;
        let tooltipText = `No contributions `;

        if (contributions >= 30) {
          colorClass = "thirty-plus-contributions";
          tooltipText = `${contributions} contributions `;
        } else if (contributions >= 20) {
          colorClass = "twenty-plus-contributions";
          tooltipText = `${contributions} contributions `;
        } else if (contributions >= 10) {
          colorClass = "ten-plus-contributions";
          tooltipText = `${contributions} contributions `;
        } else if (contributions >= 1) {
          colorClass = "one-plus-contributions";
          tooltipText = `${contributions} contributions `;
        }

        week.push(
          <div
            key={`day-${i}-${j}`}
            className={`day ${colorClass} ${
              hasContributions ? "has-contributions" : ""
            }`}
          >
            <span className="tooltip-text">
              <span>{tooltipText}</span>
              <span style={{ color: "grey", display: "block" }}>
                {tooltipText2}
              </span>
            </span>
          </div>
        );
      }

      calendar.push(week);
    }

    return calendar;
  };

  return (
    <div className="calendar">
      <div className="calendar-grid">{createCalendar()}</div>
    </div>
  );
};

export default ContributionGraph;
