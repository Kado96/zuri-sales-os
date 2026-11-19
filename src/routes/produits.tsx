import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit, Trash2, AlertTriangle, Package } from "lucide-react";
import { toast } from "sonner";
import { useZuri, uid } from "@/lib/zuri-store";
import { PageHeader, Pill } from "@/components/zuri/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fmtBIF, margin, stockState } from "@/lib/zuri-logic";
import type { Product } from "@/lib/zuri-data";

export const Route = createFileRoute("/produits")({
  head: () => ({
    meta: [
      { title: "Catalogue produits ZURI — ZURI Sales OS" },
      {
        name: "description",
        content:
          "Catalogue des articles ménagers ZURI : Ghajini, Pogo, Tusker, Titanic, Karishma, seaux et bassines.",
      },
    ],
  }),
  component: Produits,
});

const swatch: Record<string, string> = {
  Bleu: "bg-blue-600",
  Rouge: "bg-red-600",
  Vert: "bg-emerald-600",
  Rose: "bg-pink-500",
  Jaune: "bg-amber-400",
  Noir: "bg-slate-900",
  Blanc: "bg-slate-200",
};

function Produits() {
  const { products, set, t, lang } = useZuri();
  const cats = ["Tous", ...new Set(products.map((p) => p.category))];
  const [cat, setCat] = useState("Tous");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [prodToEdit, setProdToEdit] = useState<Partial<Product> | null>(null);
  const [prodToDelete, setProdToDelete] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "ZUR-",
    category: "Bassine multi-usage",
    capacity: 25,
    color: "Bleu",
    cost: 8000,
    price: 13000,
    wholesale: 11500,
    distributor: 10800,
    stock: 100,
    inProduction: 0,
    minStock: 50,
    moq: 10,
    sold30: 0,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const newP: Product = {
      id: uid("p"),
      name: formData.name || "",
      sku: formData.sku || `ZUR-${Date.now().toString().slice(-4)}`,
      category: formData.category || "Bassine multi-usage",
      capacity: Number(formData.capacity) || 10,
      color: formData.color || "Bleu",
      cost: Number(formData.cost) || 0,
      price: Number(formData.price) || 0,
      wholesale: Number(formData.wholesale) || 0,
      distributor: Number(formData.distributor) || 0,
      stock: Number(formData.stock) || 0,
      inProduction: Number(formData.inProduction) || 0,
      minStock: Number(formData.minStock) || 20,
      moq: Number(formData.moq) || 5,
      sold30: 0,
    };
    set("products", (ps) => [newP, ...ps]);
    setIsAddOpen(false);
    toast.success(lang === "fr" ? "Produit ajouté avec succès" : "Product added successfully");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodToEdit?.id) return;
    set("products", (ps) => ps.map((p) => (p.id === prodToEdit.id ? ({ ...p, ...prodToEdit } as Product) : p)));
    setIsEditOpen(false);
    toast.success(lang === "fr" ? "Produit modifié avec succès" : "Product updated successfully");
  };

  const confirmDelete = () => {
    if (!prodToDelete) return;
    set("products", (ps) => ps.filter((p) => p.id !== prodToDelete.id));
    toast.success(lang === "fr" ? "Produit supprimé" : "Product deleted");
    setProdToDelete(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("catalog")}
        subtitle={
          lang === "fr"
            ? "Articles ménagers en plastique Zahara Industries · prix en BIF"
            : "Zahara Industries household plasticware · prices in BIF"
        }
      >
        <Button onClick={() => setIsAddOpen(true)} className="gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          {lang === "fr" ? "Nouveau produit" : "New Product"}
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
              (cat === c
                ? "border-primary bg-primary text-primary-foreground font-semibold"
                : "bg-card text-muted-foreground hover:bg-muted")
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products
          .filter((p) => cat === "Tous" || p.category === cat)
          .map((p) => {
            const st = stockState(p);
            return (
              <article
                key={p.id}
                className="overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative grid h-32 place-items-center bg-secondary/50">
                  <div
                    className={
                      "h-16 w-24 rounded-b-[40px] rounded-t-md opacity-90 shadow-md " +
                      (swatch[p.color] ?? "bg-primary")
                    }
                  />
                  <span className="absolute left-3 top-3 font-display text-3xl font-extrabold text-foreground/15">
                    {p.capacity}L
                  </span>
                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    <Pill tone={st === "OK" ? "green" : st === "Faible" ? "amber" : "red"}>
                      {st === "OK" ? (lang === "fr" ? "Disponible" : "In Stock") : st}
                    </Pill>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7 opacity-85 hover:opacity-100"
                      onClick={() => {
                        setProdToEdit(p);
                        setIsEditOpen(true);
                      }}
                      title={t("edit")}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7 opacity-85 hover:opacity-100"
                      onClick={() => setProdToDelete(p)}
                      title={t("delete")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-bold">{p.name}</h3>
                    <span className="text-xs text-muted-foreground">{p.sku}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {p.category} · {p.capacity} L · {p.color}
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <dt className="text-muted-foreground">
                      {lang === "fr" ? "Prix officiel" : "Retail Price"}
                    </dt>
                    <dd className="text-right font-semibold">{fmtBIF(p.price)}</dd>
                    <dt className="text-muted-foreground">
                      {lang === "fr" ? "Grossiste" : "Wholesale"}
                    </dt>
                    <dd className="text-right">{fmtBIF(p.wholesale)}</dd>
                    <dt className="text-muted-foreground">
                      {lang === "fr" ? "Distributeur" : "Distributor"}
                    </dt>
                    <dd className="text-right">{fmtBIF(p.distributor)}</dd>
                    <dt className="text-muted-foreground">
                      {lang === "fr" ? "Coût de revient" : "Production Cost"}
                    </dt>
                    <dd className="text-right">{fmtBIF(p.cost)}</dd>
                    <dt className="text-muted-foreground">
                      {lang === "fr" ? "Marge" : "Margin"}
                    </dt>
                    <dd className="text-right font-medium text-emerald-600">
                      {margin(p).toFixed(0)} %
                    </dd>
                    <dt className="text-muted-foreground">
                      {lang === "fr" ? "Stock · MOQ" : "Stock · MOQ"}
                    </dt>
                    <dd className="text-right font-semibold">
                      {p.stock} u · {p.moq}
                    </dd>
                  </dl>
                </div>
              </article>
            );
          })}
      </div>

      {/* DIALOG AJOUT PRODUIT */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lang === "fr" ? "Ajouter un produit" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="grid gap-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold">{lang === "fr" ? "Nom" : "Name"} *</label>
                <Input
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold">SKU</label>
                <Input
                  value={formData.sku || ""}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-semibold">
                  {lang === "fr" ? "Capacité (L)" : "Capacity (L)"}
                </label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="font-semibold">{lang === "fr" ? "Couleur" : "Color"}</label>
                <select
                  className="w-full rounded-md border border-input bg-background p-2"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                >
                  {["Bleu", "Rouge", "Vert", "Rose", "Jaune", "Noir", "Blanc"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold">Stock</label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-semibold">
                  {lang === "fr" ? "Grossiste (BIF)" : "Wholesale (BIF)"}
                </label>
                <Input
                  type="number"
                  value={formData.wholesale}
                  onChange={(e) => setFormData({ ...formData, wholesale: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="font-semibold">
                  {lang === "fr" ? "Distributeur (BIF)" : "Distributor"}
                </label>
                <Input
                  type="number"
                  value={formData.distributor}
                  onChange={(e) => setFormData({ ...formData, distributor: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="font-semibold">{lang === "fr" ? "Public (BIF)" : "Retail"}</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit">{t("save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG MODIFIER PRODUIT */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lang === "fr" ? "Modifier le produit" : "Edit Product"}
            </DialogTitle>
          </DialogHeader>
          {prodToEdit && (
            <form onSubmit={handleEditSubmit} className="grid gap-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold">{lang === "fr" ? "Nom" : "Name"} *</label>
                  <Input
                    required
                    value={prodToEdit.name || ""}
                    onChange={(e) => setProdToEdit({ ...prodToEdit, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-semibold">SKU</label>
                  <Input
                    value={prodToEdit.sku || ""}
                    onChange={(e) => setProdToEdit({ ...prodToEdit, sku: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold">
                    {lang === "fr" ? "Capacité (L)" : "Capacity"}
                  </label>
                  <Input
                    type="number"
                    value={prodToEdit.capacity}
                    onChange={(e) =>
                      setProdToEdit({ ...prodToEdit, capacity: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold">{lang === "fr" ? "Couleur" : "Color"}</label>
                  <select
                    className="w-full rounded-md border border-input bg-background p-2"
                    value={prodToEdit.color}
                    onChange={(e) => setProdToEdit({ ...prodToEdit, color: e.target.value })}
                  >
                    {["Bleu", "Rouge", "Vert", "Rose", "Jaune", "Noir", "Blanc"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold">Stock</label>
                  <Input
                    type="number"
                    value={prodToEdit.stock}
                    onChange={(e) =>
                      setProdToEdit({ ...prodToEdit, stock: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold">
                    {lang === "fr" ? "Grossiste" : "Wholesale"}
                  </label>
                  <Input
                    type="number"
                    value={prodToEdit.wholesale}
                    onChange={(e) =>
                      setProdToEdit({ ...prodToEdit, wholesale: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    {lang === "fr" ? "Distributeur" : "Distributor"}
                  </label>
                  <Input
                    type="number"
                    value={prodToEdit.distributor}
                    onChange={(e) =>
                      setProdToEdit({ ...prodToEdit, distributor: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    {lang === "fr" ? "Public" : "Retail"}
                  </label>
                  <Input
                    type="number"
                    value={prodToEdit.price}
                    onChange={(e) =>
                      setProdToEdit({ ...prodToEdit, price: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <DialogFooter className="mt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("save")}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG SUPPRESSION PRODUIT */}
      <AlertDialog
        open={!!prodToDelete}
        onOpenChange={(open) => !open && setProdToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDesc")} ({prodToDelete?.name})
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
