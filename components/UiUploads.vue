<template>
  <div>
    <template v-if="readonly">
      <div
        v-for="(item, index) in fileList"
        :key="index"
        @click="handlePreview(item)"
      >
        <ui-link>{{ item.name }}</ui-link>
      </div>
      <div v-if="!fileList.length">-</div>
    </template>
    <div class="ui-uploads" v-else>
      <slot name="hint"></slot>
      <ui-upload
        action="/api/upload"
        :on-success="handleSuccess"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="limit"
        :on-exceed="handleExceed"
        with-credentials
        :show-file-list="showFileList"
        v-bind="uploadAttrs"
        ref="uploader"
      >
        <slot>
          <ui-button size="small" type="primary">{{ buttonText }}</ui-button>
          <div slot="tip" class="el-upload__tip" v-if="hint">{{ hint }}</div>
        </slot>
      </ui-upload>
    </div>
    <el-dialog
      v-if="previewUrl"
      title="文件预览"
      visible
      width="85vw"
      top="7vh"
      @close="
        () => {
          previewUrl = null;
        }
      "
    >
      <ui-flex row j-end>
        <a :href="previewUrl" target="_blank">
          <ui-link>在新窗口打开</ui-link>
        </a>
      </ui-flex>
      <iframe
        title="预览"
        :src="previewUrl"
        frameborder="0"
        style="width: 100%; height: 70vh"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'UiUploads',
  props: {
    value: { type: String, default: '' },
    limit: { type: Number, default: 10 },
    buttonText: { type: String, default: '点击上传' },
    hint: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
    handleFile: { type: Function, default: () => {} },
    showFileList: { type: Boolean, default: true },
  },
  emits: ['input'],
  data() {
    return {
      previewUrl: null,
    };
  },
  computed: {
    uploadAttrs() {
      const ret = {
        ..._.omit(this.$attrs, [
          'value',
          'limit',
          'buttonText',
          'hint',
          'readonly',
          'showFileList',
          'fileList',
        ]),
      };
      if (this.showFileList) {
        ret.fileList = this.fileList;
      }
      return ret;
    },
    fileList() {
      const urls = _.filter(String(this.value || '').split('\n'), Boolean);
      return _.map(urls, (url) => ({
        name: this.getNameFromUrl(url),
        url,
      }));
    },
  },
  methods: {
    getNameFromUrl(url) {
      return _.last(String(url || '').split('/') || []) || 'UNKNOWN_FILE';
    },
    commitValue(fileList = []) {
      const value = _.filter(
        _.uniq(_.map(fileList, (item) => item.url)),
        Boolean,
      ).join('\n');
      this.$emit('input', value);
    },
    handleSuccess(response, file, fileList) {
      this.commitValue([...fileList, { url: _.get(response, 'data.url') }]);
      this.handleFile(response, file, fileList);
    },
    handleRemove(file, fileList) {
      this.commitValue(fileList);
    },
    handlePreview(file) {
      this.previewUrl = file.url;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
      );
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    submit() {
      this.$refs.uploader.submit();
    },
  },
};
</script>

<style scoped lang="less">
.ui-uploads {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 4px 8px;
}
</style>
