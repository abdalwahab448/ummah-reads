"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CirclePlus,
  Edit3,
  Eye,
  EyeOff,
  FolderTree,
  Save,
  Trash2,
  X
} from "lucide-react";

export type OrganizationalTreeNode = {
  id: string;
  name: string;
  role: string;
  quranPath: string;
  pagesCompleted: number;
  children: OrganizationalTreeNode[];
};

type OrganizationalTreeProps = {
  initialTree?: OrganizationalTreeNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onChange?: (tree: OrganizationalTreeNode) => void;
};

type NodeEditorState = {
  name: string;
  role: string;
  quranPath: string;
  pagesCompleted: string;
};

const FULL_QURAN_PAGES = 604;

const defaultTree: OrganizationalTreeNode = {
  id: "root",
  name: "مسجد حارب بن سلطان",
  role: "المظلة التنظيمية العليا",
  quranPath: "الهيكل الكامل للمسجد",
  pagesCompleted: 0,
  children: [
    {
      id: "supervisor-general",
      name: "إدارة الحلقات",
      role: "المشرف العام",
      quranPath: "المسار القيادي",
      pagesCompleted: 184,
      children: [
        {
          id: "halaqa-1",
          name: "حلقة النور الأولى",
          role: "حلقة حفظ",
          quranPath: "الجزء 1 - 8",
          pagesCompleted: 96,
          children: []
        },
        {
          id: "halaqa-2",
          name: "حلقة البيان",
          role: "حلقة مراجعة",
          quranPath: "الجزء 9 - 16",
          pagesCompleted: 88,
          children: []
        }
      ]
    },
    {
      id: "female-section",
      name: "القسم النسائي",
      role: "إشراف تشغيلي",
      quranPath: "المسار النسائي",
      pagesCompleted: 142,
      children: [
        {
          id: "halaqa-3",
          name: "حلقة الريان",
          role: "حلقة تجويد",
          quranPath: "الجزء 17 - 24",
          pagesCompleted: 142,
          children: []
        }
      ]
    }
  ]
};

function createNodeId() {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clampPages(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return Math.min(parsed, FULL_QURAN_PAGES);
}

function computePercentage(pagesCompleted: number) {
  return Math.min(100, Math.round((pagesCompleted / FULL_QURAN_PAGES) * 100));
}

function sumTreePages(node: OrganizationalTreeNode): number {
  return node.pagesCompleted + node.children.reduce((total, child) => total + sumTreePages(child), 0);
}

function countTreeBranches(node: OrganizationalTreeNode): number {
  return node.children.reduce((total, child) => total + 1 + countTreeBranches(child), 0);
}

function updateNodeById(
  node: OrganizationalTreeNode,
  targetId: string,
  updater: (current: OrganizationalTreeNode) => OrganizationalTreeNode
): OrganizationalTreeNode {
  if (node.id === targetId) {
    return updater(node);
  }

  return {
    ...node,
    children: node.children.map((child) => updateNodeById(child, targetId, updater))
  };
}

function deleteNodeById(node: OrganizationalTreeNode, targetId: string): OrganizationalTreeNode {
  return {
    ...node,
    children: node.children
      .filter((child) => child.id !== targetId)
      .map((child) => deleteNodeById(child, targetId))
  };
}

function insertChildNode(
  node: OrganizationalTreeNode,
  targetId: string,
  newChild: OrganizationalTreeNode
): OrganizationalTreeNode {
  if (node.id === targetId) {
    return {
      ...node,
      children: [...node.children, newChild]
    };
  }

  return {
    ...node,
    children: node.children.map((child) => insertChildNode(child, targetId, newChild))
  };
}

function NodeProgress({ pagesCompleted }: { pagesCompleted: number }) {
  const percentage = computePercentage(pagesCompleted);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[var(--cream-dim)]">
        <span>نسبة الإنجاز</span>
        <span className="text-[var(--gold-soft)]">{percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[rgba(8,20,15,0.86)] ring-1 ring-[rgba(227,201,141,0.16)]">
        <div
          className="h-full rounded-full bg-[rgba(47,107,84,0.9)] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function NodeForm({
  value,
  onChange,
  onSave,
  onCancel,
  autoFocus = false
}: {
  value: NodeEditorState;
  onChange: (next: NodeEditorState) => void;
  onSave: () => void;
  onCancel: () => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="mt-4 grid gap-3 rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.82)] p-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <input
          autoFocus={autoFocus}
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
          placeholder="الاسم"
          className="w-full rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(14,28,23,0.94)] px-4 py-3 text-sm text-[var(--cream)] outline-none transition placeholder:text-[var(--cream-dim)] focus:border-[var(--gold)]"
        />
        <input
          value={value.role}
          onChange={(event) => onChange({ ...value, role: event.target.value })}
          placeholder="الصفة / المسمى"
          className="w-full rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(14,28,23,0.94)] px-4 py-3 text-sm text-[var(--cream)] outline-none transition placeholder:text-[var(--cream-dim)] focus:border-[var(--gold)]"
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <input
          value={value.quranPath}
          onChange={(event) => onChange({ ...value, quranPath: event.target.value })}
          placeholder="مسار القرآن"
          className="w-full rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(14,28,23,0.94)] px-4 py-3 text-sm text-[var(--cream)] outline-none transition placeholder:text-[var(--cream-dim)] focus:border-[var(--gold)]"
        />
        <input
          value={value.pagesCompleted}
          onChange={(event) => onChange({ ...value, pagesCompleted: event.target.value })}
          placeholder="عدد الصفحات المنجزة"
          inputMode="numeric"
          className="w-full rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(14,28,23,0.94)] px-4 py-3 text-sm text-[var(--cream)] outline-none transition placeholder:text-[var(--cream-dim)] focus:border-[var(--gold)]"
        />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(14,28,23,0.94)] px-4 py-2.5 text-sm font-semibold text-[var(--cream-dim)] transition hover:bg-[rgba(47,107,84,0.18)]"
        >
          <X className="h-4 w-4" />
          إلغاء
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--gold-soft)] px-4 py-2.5 text-sm font-semibold text-[#0f1b16] transition hover:bg-[var(--cream)]"
        >
          <Save className="h-4 w-4" />
          حفظ
        </button>
      </div>
    </div>
  );
}

function TreeNodeView({
  node,
  depth,
  isRoot,
  expandedIds,
  editingId,
  addingParentId,
  draftById,
  onToggleExpanded,
  onStartEdit,
  onCancelEdit,
  onDraftChange,
  onSaveEdit,
  onStartAdd,
  onCancelAdd,
  onSaveAdd,
  onDelete
}: {
  node: OrganizationalTreeNode;
  depth: number;
  isRoot: boolean;
  expandedIds: Set<string>;
  editingId: string | null;
  addingParentId: string | null;
  draftById: Record<string, NodeEditorState>;
  onToggleExpanded: (id: string) => void;
  onStartEdit: (node: OrganizationalTreeNode) => void;
  onCancelEdit: () => void;
  onDraftChange: (id: string, draft: NodeEditorState) => void;
  onSaveEdit: (id: string) => void;
  onStartAdd: (parentId: string) => void;
  onCancelAdd: () => void;
  onSaveAdd: (parentId: string) => void;
  onDelete: (id: string, isRootNode: boolean) => void;
}) {
  const isExpanded = expandedIds.has(node.id);
  const isEditing = editingId === node.id;
  const isAddingChild = addingParentId === node.id;
  const draft = draftById[node.id] ?? {
    name: node.name,
    role: node.role,
    quranPath: node.quranPath,
    pagesCompleted: String(node.pagesCompleted)
  };

  return (
    <div className="relative">
      {!isRoot ? (
        <span className="absolute right-[-1.25rem] top-0 h-full w-px bg-gradient-to-b from-[rgba(227,201,141,0.16)] via-[rgba(47,107,84,0.24)] to-transparent md:right-[-1.5rem]" />
      ) : null}

      <article
        className={`relative overflow-hidden rounded-[1.2rem] border transition duration-300 ${
          isRoot
            ? "border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.96)]"
            : "border-[rgba(227,201,141,0.16)] bg-[rgba(14,28,23,0.94)] hover:border-[rgba(47,107,84,0.7)]"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-[rgba(47,107,84,0.8)]" />

        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--cream-dim)]">
                <span className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(47,107,84,0.24)] px-3 py-1 text-[var(--gold-soft)]">
                  {isRoot ? "العقدة الجذرية" : `المستوى ${depth}`}
                </span>
                <span className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.84)] px-3 py-1 text-[var(--cream-dim)]">
                  {node.children.length} فرع
                </span>
              </div>

              {isEditing ? (
                <NodeForm
                  value={draft}
                  onChange={(next) => onDraftChange(node.id, next)}
                  onSave={() => onSaveEdit(node.id)}
                  onCancel={onCancelEdit}
                  autoFocus
                />
              ) : (
                <div className="space-y-2">
                  <h3 className="font-['Reem_Kufi'] text-2xl text-[var(--cream)] sm:text-3xl">{node.name}</h3>
                  <p className="text-sm font-medium text-[var(--gold-soft)]">{node.role}</p>
                  <p className="max-w-2xl text-sm leading-7 text-[var(--cream-dim)]">{node.quranPath}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start">
              {node.children.length > 0 ? (
                <button
                  type="button"
                  onClick={() => onToggleExpanded(node.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.84)] px-3 py-2 text-sm font-semibold text-[var(--cream-dim)] transition hover:bg-[rgba(47,107,84,0.18)]"
                >
                  {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {isExpanded ? "إخفاء الفروع" : "عرض الفروع"}
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => onStartEdit(node)}
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.84)] px-3 py-2 text-sm font-semibold text-[var(--cream-dim)] transition hover:bg-[rgba(47,107,84,0.18)]"
              >
                <Edit3 className="h-4 w-4" />
                تعديل
              </button>

              <button
                type="button"
                onClick={() => onStartAdd(node.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--gold-soft)] px-3 py-2 text-sm font-semibold text-[#0f1b16] transition hover:bg-[var(--cream)]"
              >
                <CirclePlus className="h-4 w-4" />
                إضافة فرع
              </button>

              {!isRoot ? (
                <button
                  type="button"
                  onClick={() => onDelete(node.id, isRoot)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.84)] p-4">
              <p className="text-xs font-semibold text-[var(--cream-dim)]">الصفحات المنجزة</p>
              <p className="mt-2 text-2xl font-bold text-[var(--cream)]">{node.pagesCompleted}</p>
              <p className="mt-1 text-xs text-[var(--cream-dim)]">من أصل {FULL_QURAN_PAGES} صفحة</p>
            </div>
            <div className="rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.84)] p-4">
              <p className="text-xs font-semibold text-[var(--cream-dim)]">المسار</p>
              <p className="mt-2 break-words text-sm font-semibold text-[var(--cream)]">{node.quranPath}</p>
            </div>
            <div className="rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.84)] p-4">
              <p className="text-xs font-semibold text-[var(--cream-dim)]">نسبة العقدة</p>
              <p className="mt-2 text-2xl font-bold text-[var(--gold-soft)]">{computePercentage(node.pagesCompleted)}%</p>
            </div>
          </div>

          <div className="mt-5">
            <NodeProgress pagesCompleted={node.pagesCompleted} />
          </div>

          {isAddingChild ? (
            <NodeForm
              value={draft}
              onChange={(next) => onDraftChange(node.id, next)}
              onSave={() => onSaveAdd(node.id)}
              onCancel={onCancelAdd}
              autoFocus
            />
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && node.children.length > 0 ? (
            <motion.div
              key={`${node.id}-children`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="overflow-hidden border-t border-[rgba(227,201,141,0.14)] bg-[rgba(8,20,15,0.62)]"
            >
              <div className="space-y-4 p-4 sm:p-5">
                {node.children.map((child) => (
                  <div key={child.id} className="pl-2 sm:pl-4">
                    <TreeNodeView
                      node={child}
                      depth={depth + 1}
                      isRoot={false}
                      expandedIds={expandedIds}
                      editingId={editingId}
                      addingParentId={addingParentId}
                      draftById={draftById}
                      onToggleExpanded={onToggleExpanded}
                      onStartEdit={onStartEdit}
                      onCancelEdit={onCancelEdit}
                      onDraftChange={onDraftChange}
                      onSaveEdit={onSaveEdit}
                      onStartAdd={onStartAdd}
                      onCancelAdd={onCancelAdd}
                      onSaveAdd={onSaveAdd}
                      onDelete={onDelete}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </article>
    </div>
  );
}

export function OrganizationalTree({
  initialTree = defaultTree,
  title = "الهيكل التنظيمي للمسجد",
  subtitle = "تحكم مباشر في الفروع، مع تحرير فوري، وإضافة عقد جديدة، وحذف منظم مع عرض تقدّم كل فرع على أساس 604 صفحة.",
  className,
  onChange
}: OrganizationalTreeProps) {
  const [tree, setTree] = useState<OrganizationalTreeNode>(initialTree);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set([initialTree.id]));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingParentId, setAddingParentId] = useState<string | null>(null);
  const [draftById, setDraftById] = useState<Record<string, NodeEditorState>>({});

  const rootSummary = useMemo(() => {
    const totalPages = sumTreePages(tree);

    return {
      totalPages,
      branchCount: countTreeBranches(tree),
      completion: computePercentage(totalPages)
    };
  }, [tree]);

  function commitTree(nextTree: OrganizationalTreeNode) {
    setTree(nextTree);
    onChange?.(nextTree);
  }

  function toggleExpanded(nodeId: string) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }

      return next;
    });
  }

  function startEdit(node: OrganizationalTreeNode) {
    setEditingId(node.id);
    setAddingParentId(null);
    setDraftById({
      [node.id]: {
        name: node.name,
        role: node.role,
        quranPath: node.quranPath,
        pagesCompleted: String(node.pagesCompleted)
      }
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraftById({});
  }

  function startAdd(parentId: string) {
    setAddingParentId(parentId);
    setEditingId(null);
    setExpandedIds((current) => new Set(current).add(parentId));
    setDraftById({
      [parentId]: {
        name: "",
        role: "",
        quranPath: "",
        pagesCompleted: "0"
      }
    });
  }

  function cancelAdd() {
    setAddingParentId(null);
    setDraftById({});
  }

  function updateDraft(nodeId: string, draft: NodeEditorState) {
    setDraftById((current) => ({
      ...current,
      [nodeId]: draft
    }));
  }

  function saveEdit(nodeId: string) {
    const draft = draftById[nodeId];
    if (!draft?.name.trim()) {
      return;
    }

    const nextTree = updateNodeById(tree, nodeId, (current) => ({
      ...current,
      name: draft.name.trim(),
      role: draft.role.trim(),
      quranPath: draft.quranPath.trim(),
      pagesCompleted: clampPages(draft.pagesCompleted)
    }));

    commitTree(nextTree);
    cancelEdit();
  }

  function saveAdd(parentId: string) {
    const draft = draftById[parentId];
    if (!draft?.name.trim()) {
      return;
    }

    const newChild: OrganizationalTreeNode = {
      id: createNodeId(),
      name: draft.name.trim(),
      role: draft.role.trim(),
      quranPath: draft.quranPath.trim(),
      pagesCompleted: clampPages(draft.pagesCompleted),
      children: []
    };

    const nextTree = insertChildNode(tree, parentId, newChild);
    commitTree(nextTree);
    setExpandedIds((current) => new Set(current).add(parentId));
    cancelAdd();
  }

  function deleteNode(nodeId: string, isRootNode: boolean) {
    if (isRootNode) {
      return;
    }

    const nextTree = deleteNodeById(tree, nodeId);
    commitTree(nextTree);
    setEditingId((current) => (current === nodeId ? null : current));
    setAddingParentId((current) => (current === nodeId ? null : current));
  }

  return (
    <section
      dir="rtl"
      className={`relative overflow-hidden rounded-[2.2rem] border border-[rgba(227,201,141,0.16)] bg-[linear-gradient(180deg,rgba(14,28,23,0.96),rgba(8,20,15,0.98))] text-[var(--cream)] shadow-[0_28px_100px_rgba(2,6,23,0.45)] ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(227,201,141,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(47,107,84,0.16),transparent_28%),linear-gradient(180deg,rgba(16,28,24,0.65),rgba(6,16,13,0.98))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative p-5 sm:p-7 lg:p-9">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(227,201,141,0.18)] bg-[rgba(47,107,84,0.2)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              <FolderTree className="h-4 w-4" />
              التنظيم القرآني
            </div>
            <div className="space-y-3">
              <h2 className="font-['Reem_Kufi'] text-3xl leading-tight text-[var(--cream)] sm:text-4xl lg:text-5xl">{title}</h2>
              <p className="max-w-2xl text-sm leading-7 text-[var(--cream-dim)] sm:text-base">{subtitle}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[28rem]">
            <div className="rounded-[1.2rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.82)] p-4 backdrop-blur-md">
              <p className="text-xs font-semibold text-[var(--cream-dim)]">النسبة الكلية</p>
              <p className="mt-2 text-3xl font-black text-[var(--gold-soft)]">{rootSummary.completion}%</p>
            </div>
            <div className="rounded-[1.2rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.82)] p-4 backdrop-blur-md">
              <p className="text-xs font-semibold text-[var(--cream-dim)]">إجمالي الصفحات</p>
              <p className="mt-2 text-3xl font-black text-[var(--cream)]">{rootSummary.totalPages}</p>
            </div>
            <div className="rounded-[1.2rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.82)] p-4 backdrop-blur-md">
              <p className="text-xs font-semibold text-[var(--cream-dim)]">عدد الفروع</p>
              <p className="mt-2 text-3xl font-black text-[var(--cream)]">{rootSummary.branchCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[1.2rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.82)] p-4 text-sm text-[var(--cream-dim)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cream-dim)]">المسار النشط</p>
              <p className="mt-1 font-semibold text-[var(--cream)]">مسجد حارب بن سلطان</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--cream-dim)]">
              <ChevronLeft className="h-4 w-4" />
              <ChevronRight className="h-4 w-4" />
              <ChevronDown className="h-4 w-4" />
              <ChevronUp className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <TreeNodeView
            node={tree}
            depth={0}
            isRoot
            expandedIds={expandedIds}
            editingId={editingId}
            addingParentId={addingParentId}
            draftById={draftById}
            onToggleExpanded={toggleExpanded}
            onStartEdit={startEdit}
            onCancelEdit={cancelEdit}
            onDraftChange={updateDraft}
            onSaveEdit={saveEdit}
            onStartAdd={startAdd}
            onCancelAdd={cancelAdd}
            onSaveAdd={saveAdd}
            onDelete={deleteNode}
          />
        </div>
      </div>
    </section>
  );
}