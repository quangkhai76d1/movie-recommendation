import React, { useEffect, useState } from "react";
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { DebounceInput } from "react-debounce-input";
import { useDispatch } from "react-redux";
import { load_movies } from "../actions/movie.js";
import _ from "lodash";
import movieApi from "../api/movieApi";

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState({
    title: "",
    orderby: "-release",
    genre: "",
    keyword: "",
  });

  useEffect(() => {
    dispatch(load_movies(searchParams));
  }, [searchParams, dispatch]);

  const loadGenreOptions = async (value, callback) => {
    try {
      const { results } = await movieApi.getGenres(value);
      callback(results.map(({ name }) => ({ value: name, label: name })));
    } catch (err) {
      callback([]);
    }
  };

  const loadKeywordOptions = async (value, callback) => {
    try {
      const { results } = await movieApi.getKeys(value);
      callback(results.map(({ key }) => ({ value: key, label: key })));
    } catch (err) {
      callback([]);
    }
  };

  return (
    <Form>
      <Row>
        <FormGroup as={Col} md={6}>
          <FormLabel>Movies Title Contain</FormLabel>
          <DebounceInput
            element={FormControl}
            minLength={2}
            onChange={(e) =>
              setSearchParams({ ...searchParams, title: e.target.value })
            }
            value={setSearchParams.title}
            debounceTimeout={1000}
          />
        </FormGroup>
        <FormGroup as={Col} md={2}>
          <FormLabel>Genre</FormLabel>
          <AsyncSelect
            loadOptions={loadGenreOptions}
            defaultOptions={[{ label: "Default", value: "" }]}
            onChange={({ value }) =>
              setSearchParams({ ...searchParams, genre: value })
            }
          />
        </FormGroup>
        <FormGroup as={Col} md={2}>
          <FormLabel>Keyword</FormLabel>
          <AsyncSelect
            loadOptions={loadKeywordOptions}
            defaultOptions={[{ label: "Default", value: "" }]}
            onChange={({ value }) =>
              setSearchParams({ ...searchParams, keyword: value })
            }
          />
        </FormGroup>
        <FormGroup as={Col} md={2}>
          <FormLabel>Order By</FormLabel>
          <Select
            options={[
              { value: "-release", label: "Release" },
              { value: "-rating", label: "Rating" },
              { value: "-vote", label: "Vote Count" },
              { value: "-popularity", label: "Popularity" },
            ]}
            defaultValue={{ value: "-release", label: "Release" }}
            name="orderby"
            onChange={(e) =>
              setSearchParams({ ...searchParams, orderby: e.value })
            }
          />
        </FormGroup>
      </Row>
    </Form>
  );
};

export default Search;
