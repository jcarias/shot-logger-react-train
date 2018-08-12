export const urls = {
  home: { name: "Home", path: "/" },
  shotList: { name: "Injeções", path: "/shot-list" },
  inputShot: { name: "Adicionar Injeção", path: "/input-shot" },
  add: { name: "Add", path: "/add" },
  prescriptions: { name: "Prescrições", path: "/prescriptions" },
  inputPrescriptions: {
    name: "Adicionar Prescrição",
    path: "/input-prescripton"
  },
  editPrescription: {
    name: "Editar Prescrição",
    path: "/input-prescripton/:id",
    pathWithoutParam: "/input-prescripton/"
  }
};

export const navBarUrls = {
  shots: urls.shotList,
  prescriptions: urls.prescriptions
};
