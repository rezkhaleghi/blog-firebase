import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
  HttpStatus,
  Res,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Request, Response } from 'express';
import { FirebaseAuthGuard } from 'src/api/guards/firebase-auth-guard';
import { CreateBlogDto } from 'src/application/DTOs/blog.dto';
import { BlogService } from 'src/application/services/blog.service';
import { multerConfig, multerOptions } from 'src/infrastructure/multer.config';

@Controller('api/posts')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('')
  @UseGuards(FirebaseAuthGuard)
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    try {
      const user = req['user'];
      const userId = user.userId;

      const response = await this.blogService.findAll(
        userId,
        Number(page),
        Number(limit),
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blogs fetched successfully',
        data: response,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = req['user'];
      const userId = user.userId;

      const response = await this.blogService.findOne(id, userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog fetched successfully',
        data: response,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: Request,

    @Res() res: Response,
  ) {
    try {
      const user = req['user'];
      const userId = user.userId;

      const response = await this.blogService.create(createBlogDto, userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog created successfully',
        data: response.id,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateBlogDto: Partial<CreateBlogDto>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = req['user'];
      const userId = user.userId;

      const response = await this.blogService.update(id, updateBlogDto, userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog updated successfully',
        data: response.id,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  async remove(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = req['user'];
      const userId = user.userId;

      await this.blogService.remove(id, userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog deleted successfully',
        data: null,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Get('explorer/all')
  async findAllPublished(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
  ) {
    try {
      const response = await this.blogService.findAllPublished(
        Number(page),
        Number(limit),
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Published blogs fetched successfully',
        data: response,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Get('explorer/:id')
  async findPublishedById(@Param('id') id: number, @Res() res: Response) {
    try {
      const response = await this.blogService.findPublishedById(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Published blog fetched successfully',
        data: response,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Get('explorer/by-user/:userId')
  async findPublishedByUserId(
    @Param('userId') userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
  ) {
    try {
      const response = await this.blogService.findPublishedByUserId(
        Number(userId),
        Number(page),
        Number(limit),
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Published blogs by user fetched successfully',
        data: response,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Post(':id/image')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerConfig.storage,
      fileFilter: multerOptions.fileFilter,
    }),
  )
  async uploadImage(
    @Param('id') id: number,
    @UploadedFile() file: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = req['user'];
      const userId = user.userId;

      const imageUrl = `/uploads/${file.filename}`;
      const response = await this.blogService.uploadImage(id, imageUrl, userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Image uploaded successfully',
        data: response,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }

  @Delete(':id/image')
  @UseGuards(FirebaseAuthGuard)
  async removeImage(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = req['user'];
      const userId = user.userId;

      const response = await this.blogService.removeImage(id, userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Image removed successfully',
        data: response,
        error: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      });
    }
  }
}
