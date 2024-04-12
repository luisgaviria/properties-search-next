"use client"
import {Pagination} from "../app/client-react-boostrap";

export const findBordersBy9 = (number: number) => {
  // algorithm for finding correct borders
  const uniqueBorders: number[] = [];
  if (number % 9 == 0) {
    for (let i = number; i < number + 10; i++) {
      uniqueBorders.push(i);
    }
    uniqueBorders.sort((a, b) => a - b);
    return uniqueBorders;
  } else {
    const borders = [];
    let temp = number;
    while (temp % 9 != 0) {
      borders.push(temp);
      temp--;
    }
    if (temp) {
      borders.push(temp);
    }
    temp = number;
    while (temp % 9 != 0) {
      borders.push(temp);
      temp++;
    }
    borders.push(temp);
    borders.forEach((element) => {
      if (!uniqueBorders.includes(element)) {
        uniqueBorders.push(element);
      }
    });
    uniqueBorders.sort((a, b) => a - b);
    return uniqueBorders;
  }
};

export const createPagination = (pages: number,page: number,getData: (number: number)=>{})=>{
    let items = [];
    if(pages > 833){
      pages = 833;
    }
    if (pages >= 10) {
      if (page == 1) {
        for (let number = 1; number < 10; number++) {
          items.push(
            <Pagination.Item
              onClick={() => {
                // props.changePage(number);
                getData(number);
              }}
              key={number}
              active={number === page}
            >
              {number}
            </Pagination.Item>
          );
        }
        items.push(<Pagination.Ellipsis />);
        items.push(
          <Pagination.Item
            key={pages}
            active={pages === page}
            onClick={() => {
              // props.changePage(state.pagination.pages);
              getData(pages);
            }}
          >
            {pages}
          </Pagination.Item>
        );
        items.push(
          <Pagination.Next
            onClick={() => {
              // props.changePage(state.page + 1);
              getData(page + 1);
            }}
          />
        );
      } else if (page > 1 && page < 9) {
        items.push(
          <Pagination.Prev
            onClick={() => {
              // props.changePage(page - 1);
              getData(page - 1);
            }}
          />
        );
        for (let number = 1; number < 10; number++) {
          items.push(
            <Pagination.Item
              onClick={() => {
                // props.changePage(number);
                getData(number);
              }}
              key={number}
              active={number === page}
            >
              {number}
            </Pagination.Item>
          );
        }
        items.push(<Pagination.Ellipsis />);
        items.push(
          <Pagination.Item
            onClick={() => {
              // props.changePage(state.pagination.pages);
              getData(pages);
            }}
            key={pages}
            active={pages === page}
          >
            {pages}
          </Pagination.Item>
        );
        items.push(
          <Pagination.Next
            onClick={() => {
              // props.changePage(state.page + 1);
              getData(page + 1);
            }}
          />
        );
      } else if (page >= 9 && page < pages - 9) {
        items.push(
          <Pagination.Prev
            onClick={() => {
              // props.changePage(page - 1);
              getData(page - 1);
            }}
          />
        );
        items.push(
          <Pagination.Item
            onClick={() => {
              // props.changePage(1);
              getData(1);
            }}
          >
            1
          </Pagination.Item>
        );
        items.push(<Pagination.Ellipsis />);
        const borders = findBordersBy9(page);
        console.log(borders);
        for (let i = borders[0]; i <= borders[9]; i++) {
          items.push(
            <Pagination.Item
              onClick={() => {
                // props.changePage(i);
                getData(i);
              }}
              key={i}
              active={i === page}
            >
              {i}
            </Pagination.Item>
          );
        }
        items.push(<Pagination.Ellipsis />);
        items.push(
          <Pagination.Item
            onClick={() => {
              // props.changePage(state.pagination.pages);
              getData(pages);
            }}
          >
            {pages}
          </Pagination.Item>
        );
        items.push(
          <Pagination.Next
            onClick={() => {
              // props.changePage(state.page + 1);
              getData(page + 1);
            }}
          />
        );
      } else if (
        page >= pages - 9 &&
        page < pages
      ) {
        items.push(
          <Pagination.Prev
            onClick={() => {
              // props.changePage(state.page - 1);
              getData(page - 1);
            }}
          />
        );
        items.push(
          <Pagination.Item
            onClick={() => {
              // props.changePage(1);
              getData(1);
            }}
          >
            1
          </Pagination.Item>
        );
        items.push(<Pagination.Ellipsis />);
        for (
          let i = pages - 9;
          i <= pages;
          i++
        ) {
          items.push(
            <Pagination.Item
              onClick={() => {
                // props.changePage(i);
                getData(i);
              }}
              key={i}
              active={i === page}
            >
              {i}
            </Pagination.Item>
          );
        }
        items.push(
          <Pagination.Next
            onClick={() => {
              // props.changePage(state.page + 1);
              getData(page + 1);
            }}
          />
        );
        // items.push(<Pagination.Item></Pagination.Item>);
      } else if (page == pages) {
        items.push(
          <Pagination.Prev
            onClick={() => {
              // props.changePage(page - 1);
              getData(page - 1);
            }}
          />
        );
        items.push(
          <Pagination.Item
            onClick={() => {
              // props.changePage(1);
              getData(1);
            }}
          >
            1
          </Pagination.Item>
        );
        items.push(<Pagination.Ellipsis />);
        for (
          let i = pages - 9;
          i <= pages;
          i++
        ) {
          items.push(
            <Pagination.Item
              onClick={() => {
                // props.changePage(i);
                getData(i);
              }}
              key={i}
              active={i === page}
            >
              {i}
            </Pagination.Item>
          );
        }
      }
      //    1 2 3 4 5 6 7 8 9 ... 120 > // in case of 1  done
      //  < 1 2 3 4 5 6 7 8 9 ... 120 > // in case of 2  done
      //  < 1 ... 9 10 11 12 13 14 15 16 17 18 ... 120 >
      //  < 1 ... 9 10 11 12 13 14 15 16 17 18 ... 120 >
      //  < 1 ... 18 19 20 21 22 23 24 25 26 ... 120 > in case of middle done
      // < 1 ... 111 112 113 114 115 116 117 118 119 120 > in case of 119 done
      // < 1 ... 111 112 113 114 115 116 117 118 119 120 in case of 120
      // items.push(<Pagination.Item>
      //     {}
      // </Pagination.Item>);
    } else {
      for (let number = 1; number <= pages; number++) {
        items.push(
          <Pagination.Item
            onClick={() => {
              // props.changePage(number);
              getData(number);
            }}
            key={number}
            active={number === page}
          >
            {number}
          </Pagination.Item>
        );
      }
    }
    return items;
};