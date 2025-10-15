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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Contact } from '@/types/contact';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Building,
    Calendar,
    Edit,
    Heart,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface ContactShowProps {
    contact: Contact;
}

export default function ContactShow({ contact }: ContactShowProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const getInitials = () => {
        return `${contact.first_name[0]}${contact.last_name[0]}`.toUpperCase();
    };

    const toggleFavorite = () => {
        router.post(
            `/api/contacts/${contact.id}/toggle-favorite`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['contact'] });
                },
            },
        );
    };

    const handleDelete = () => {
        router.delete(`/api/contacts/${contact.id}`, {
            onSuccess: () => {
                router.visit('/contacts');
            },
        });
    };

    const formatDate = (date: string | null) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title={contact.full_name} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href="/contacts">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại danh sách
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleFavorite}
                        >
                            <Heart
                                className={`h-4 w-4 ${
                                    contact.is_favorite
                                        ? 'fill-red-500 text-red-500'
                                        : ''
                                }`}
                            />
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/contacts/${contact.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="text-destructive"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Left Column - Contact Card */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <Avatar className="mx-auto h-32 w-32">
                                    <AvatarImage
                                        src={contact.avatar_url || undefined}
                                    />
                                    <AvatarFallback className="text-3xl">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="mt-4 text-2xl">
                                    {contact.full_name}
                                </CardTitle>
                                {contact.job_title && (
                                    <CardDescription className="text-base">
                                        {contact.job_title}
                                        {contact.company &&
                                            ` tại ${contact.company}`}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Group */}
                                {contact.group && (
                                    <div>
                                        <label className="text-sm text-muted-foreground">
                                            Nhóm
                                        </label>
                                        <div className="mt-1">
                                            <Badge
                                                variant="secondary"
                                                style={{
                                                    backgroundColor:
                                                        contact.group.color,
                                                }}
                                            >
                                                {contact.group.name}
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {contact.tags && contact.tags.length > 0 && (
                                    <div>
                                        <label className="text-sm text-muted-foreground">
                                            Nhãn
                                        </label>
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {contact.tags.map((tag) => (
                                                <Badge
                                                    key={tag.id}
                                                    variant="outline"
                                                    style={{
                                                        borderColor: tag.color,
                                                        color: tag.color,
                                                    }}
                                                >
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="space-y-2 pt-4">
                                    <Button
                                        className="w-full"
                                        variant="default"
                                        asChild
                                    >
                                        <a href={`tel:${contact.phone_number}`}>
                                            <Phone className="mr-2 h-4 w-4" />
                                            Gọi điện
                                        </a>
                                    </Button>
                                    {contact.email && (
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            asChild
                                        >
                                            <a href={`mailto:${contact.email}`}>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Gửi email
                                            </a>
                                        </Button>
                                    )}
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        asChild
                                    >
                                        <a href={`sms:${contact.phone_number}`}>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Nhắn tin
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Contact Details */}
                    <div className="space-y-6 md:col-span-2">
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin liên hệ</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Phone */}
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            Số điện thoại
                                        </p>
                                        <p className="font-medium">
                                            {contact.phone_number}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                {contact.email && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="font-medium">
                                                {contact.email}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Address */}
                                {contact.address && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">
                                                Địa chỉ
                                            </p>
                                            <p className="font-medium">
                                                {contact.address}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Birthday */}
                                {contact.birthday && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">
                                                Ngày sinh
                                            </p>
                                            <p className="font-medium">
                                                {formatDate(contact.birthday)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Work Information */}
                        {(contact.company || contact.job_title) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin công việc</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Company */}
                                    {contact.company && (
                                        <div className="flex items-start gap-3">
                                            <Building className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                            <div className="flex-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Công ty
                                                </p>
                                                <p className="font-medium">
                                                    {contact.company}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Job Title */}
                                    {contact.job_title && (
                                        <div className="flex items-start gap-3">
                                            <Briefcase className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                            <div className="flex-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Chức vụ
                                                </p>
                                                <p className="font-medium">
                                                    {contact.job_title}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Additional Notes */}
                        {contact.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ghi chú</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {contact.notes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa liên hệ</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa{' '}
                            <strong>{contact.full_name}</strong>? Hành động này
                            không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
