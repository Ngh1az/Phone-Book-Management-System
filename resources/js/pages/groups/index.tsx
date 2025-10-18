import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import AppLayout from '@/layouts/app-layout';
import { Group, PaginatedResponse } from '@/types/contact';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface GroupsIndexProps {
    groups: PaginatedResponse<Group & { contacts_count: number }>;
    filters: {
        search?: string;
    };
}

export default function GroupsIndex({ groups, filters }: GroupsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteGroup, setDeleteGroup] = useState<
        (Group & { contacts_count: number }) | null
    >(null);

    useDebounce(
        () => {
            router.get(
                '/groups',
                { search: search || undefined },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        },
        500,
        [search],
    );

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
    };

    const confirmDelete = (group: Group & { contacts_count: number }) => {
        setDeleteGroup(group);
    };

    const handleDelete = () => {
        if (!deleteGroup) return;

        router.delete(`/groups/${deleteGroup.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setDeleteGroup(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Quản lý nhóm" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Quản lý nhóm
                        </h1>
                        <p className="text-muted-foreground">
                            Tổ chức liên hệ theo nhóm
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/groups/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm nhóm
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm nhóm..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Groups Grid */}
                {groups.data.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {groups.data.map((group) => (
                            <Card
                                key={group.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-10 w-10 rounded-lg"
                                                style={{
                                                    backgroundColor:
                                                        group.color,
                                                }}
                                            />
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {group.name}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1 text-sm">
                                                    <Users className="h-3 w-3" />
                                                    {group.contacts_count} liên
                                                    hệ
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                {group.description && (
                                    <CardContent>
                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {group.description}
                                        </p>
                                    </CardContent>
                                )}
                                <CardContent className="flex gap-2 pt-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        asChild
                                    >
                                        <Link href={`/groups/${group.id}`}>
                                            Xem chi tiết
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/groups/${group.id}/edit`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => confirmDelete(group)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex min-h-[200px] flex-col items-center justify-center py-12">
                            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-1 text-lg font-semibold">
                                Chưa có nhóm nào
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Tạo nhóm đầu tiên để tổ chức liên hệ
                            </p>
                            <Button asChild>
                                <Link href="/groups/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm nhóm
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {groups.data.length > 0 && groups.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                router.get(
                                    '/groups',
                                    {
                                        search: search || undefined,
                                        page: groups.current_page - 1,
                                    },
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                            disabled={groups.current_page === 1}
                        >
                            ← Trước
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Trang {groups.current_page} / {groups.last_page}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => {
                                router.get(
                                    '/groups',
                                    {
                                        search: search || undefined,
                                        page: groups.current_page + 1,
                                    },
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                            disabled={groups.current_page === groups.last_page}
                        >
                            Sau →
                        </Button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deleteGroup}
                onOpenChange={() => setDeleteGroup(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa nhóm{' '}
                            <strong>{deleteGroup?.name}</strong>? Nhóm này có{' '}
                            <strong>{deleteGroup?.contacts_count}</strong> liên
                            hệ.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Xóa nhóm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
