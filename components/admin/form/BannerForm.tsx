import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function BannerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>Banner form</h2>

      <div>
        <label>Title:</label>
        <input {...register("title")} />
      </div>

      <div>
        <label>Title Link:</label>
        <input {...register("title_link")} />
      </div>

      <div>
        <label>Style:</label>
        <input {...register("style")} />
      </div>

      <div>
        <label>Unique Group Key:</label>
        <input {...register("unique_grp_key")} />
      </div>

      <div>
        <label>Type:</label>
        <input {...register("type")} />
      </div>

      <fieldset>
        <legend>Custom Component</legend>
        <div>
          <label>Component Style:</label>
          <input {...register("customComponent.style")} />
        </div>

        <div>
          <label>Component Name:</label>
          <input {...register("customComponent.component")} />
        </div>
      </fieldset>

      <div>
        <label>Background Image :</label>
        <input type="file" name="backgroud-img" />
      </div>

      <div>
        <label>Background Link:</label>
        <input {...register("backgroud_link")} />
      </div>

      <div>
        <label>Data:</label>
        <textarea {...register("data")} />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default BannerForm;
